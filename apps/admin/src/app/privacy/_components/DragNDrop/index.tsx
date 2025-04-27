'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { Button, Card, Group, TextInput, Textarea } from '@mantine/core';
import { useDebouncedCallback, useListState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import cx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { createPrivacySection } from '../../_actions/createPrivacySection';
import { deletePrivacySection } from '../../_actions/deletePrivacySection';
import { reorderPrivacySections } from '../../_actions/reorderPrivacySections';
import { updatePrivacySection } from '../../_actions/updatePrivacySection';
import { PrivacySection } from '../../_types/types';
import classes from './DndList.module.css';

// Input styles to remove borders when not focused
const inputStyles = {
    input: {
        border: 'none',
        '&:focus': {
            border: '1px solid var(--mantine-color-blue-filled)'
        }
    }
};

interface DragNDropProps {
    initialData: PrivacySection[];
}

export function DragNDrop({ initialData }: DragNDropProps) {
    const [state, handlers] = useListState<PrivacySection>(initialData);
    const [editingStates, setEditingStates] = useState<Record<string, { title: string; content: string }>>({});

    // Initialize editing states with initial data
    useEffect(() => {
        const initialEditingStates: Record<string, { title: string; content: string }> = {};
        initialData.forEach((section) => {
            initialEditingStates[section.id] = {
                title: section.title,
                content: section.content,
            };
        });
        setEditingStates(initialEditingStates);
    }, [initialData]);

    const debouncedSaveOrder = useDebouncedCallback((items: PrivacySection[]) => {
        (async () => {
            try {
                const result = await reorderPrivacySections(items);
                if (result.success) {
                    notifications.show({
                        title: 'Success',
                        message: 'Order updated successfully',
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        title: 'Error',
                        message: result.error || 'Failed to update order',
                        color: 'red',
                    });
                }
            } catch (error) {
                console.log(error);
                notifications.show({
                    title: 'Error',
                    message: 'An unexpected error occurred',
                    color: 'red',
                });
            }
        })();
    }, 1000);

    const debouncedSaveContent = useDebouncedCallback((id: string, title: string, content: string) => {
        (async () => {
            try {
                const result = await updatePrivacySection(id, { title, content });
                if (result.success) {
                    notifications.show({
                        title: 'Success',
                        message: 'Content updated successfully',
                        color: 'green',
                    });
                } else {
                    notifications.show({
                        title: 'Error',
                        message: result.error || 'Failed to update content',
                        color: 'red',
                    });
                }
            } catch (error) {
                console.log(error);
                notifications.show({
                    title: 'Error',
                    message: 'An unexpected error occurred',
                    color: 'red',
                });
            }
        })();
    }, 1000);

    const handleTextChange = useCallback((id: string, field: 'title' | 'content', value: string) => {
        setEditingStates((prev) => {
            // Get existing values with fallbacks to empty strings
            const existingTitle = prev[id]?.title || '';
            const existingContent = prev[id]?.content || '';

            return {
                ...prev,
                [id]: {
                    title: field === 'title' ? value : existingTitle,
                    content: field === 'content' ? value : existingContent,
                },
            };
        });

        const section = state.find((item) => item.id === id);
        if (section) {
            debouncedSaveContent(
                id,
                field === 'title' ? value : editingStates[id]?.title || section.title,
                field === 'content' ? value : editingStates[id]?.content || section.content
            );
        }
    }, [state, editingStates, debouncedSaveContent]);

    const handleAddNewSection = async () => {
        const result = await createPrivacySection();

        if (result.success) {
            // When success is true, TypeScript now knows that data exists
            handlers.append(result.data);
            setEditingStates((prev) => ({
                ...prev,
                [result.data.id]: {
                    title: result.data.title,
                    content: result.data.content,
                },
            }));
            notifications.show({
                title: 'Success',
                message: 'New section added successfully',
                color: 'green',
            });
        } else {
            notifications.show({
                title: 'Error',
                message: result.error || 'Failed to add new section',
                color: 'red',
            });
        }
    };

    const handleDeleteSection = async (id: string, index: number) => {
        const result = await deletePrivacySection(id);
        if (result.success) {
            handlers.remove(index);
            setEditingStates((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
            notifications.show({
                title: 'Success',
                message: 'Section deleted successfully',
                color: 'green',
            });
        } else {
            notifications.show({
                title: 'Error',
                message: result.error || 'Failed to delete section',
                color: 'red',
            });
        }
    };

    const items = state.map((item, index) => (
        <Draggable key={item.id} index={index} draggableId={item.id}>
            {(provided, snapshot) => (
                <div
                    className={cx(classes.item, { [classes.itemDragging ?? '']: snapshot.isDragging })}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <Card withBorder p="md" radius="md" className="w-100">
                        <TextInput
                            label="Section Title"
                            value={editingStates[item.id]?.title || item.title}
                            onChange={(event) => handleTextChange(item.id, 'title', event.target.value)}
                            mb="md"
                            styles={inputStyles}
                        />
                        <Textarea
                            label="Content"
                            value={editingStates[item.id]?.content || item.content}
                            onChange={(event) => handleTextChange(item.id, 'content', event.target.value)}
                            minRows={5}
                            mb="md"
                            autosize
                            styles={inputStyles}
                        />
                        <Group justify="flex-end">
                            <Button color="red" variant="light" onClick={() => handleDeleteSection(item.id, index)}>
                                Delete Section
                            </Button>
                        </Group>
                    </Card>
                </div>
            )}
        </Draggable>
    ));

    return (
        <>
            <Button
                color="green.8"
                variant="filled"
                onClick={handleAddNewSection}
                mb="md"
                leftSection={<span>+</span>}
            >
                Add New Section
            </Button>

            <DragDropContext
                onDragEnd={({ destination, source }) => {
                    // Do nothing if dropped outside the list or dropped in the same position
                    if (!destination ||
                        (destination.droppableId === source.droppableId &&
                            destination.index === source.index)) {
                        return;
                    }

                    // Check if order actually changed
                    const samePosition = destination.index === source.index;
                    if (samePosition) {
                        return; // No need to update if position hasn't changed
                    }

                    // Create a copy of the current state to work with
                    const updatedItems = [...state];

                    // Remove the dragged item from its original position
                    const [movedItem] = updatedItems.splice(source.index, 1)!;

                    // Check if the moved item is valid before proceeding
                    if (movedItem) {
                        // Insert the item at the new position
                        updatedItems.splice(destination.index, 0, movedItem);
                    }

                    // Update the local state
                    handlers.setState(updatedItems);

                    // Create array with updated order values
                    const itemsWithNewOrder = updatedItems.map((item, i) => ({
                        ...item,
                        order: i
                    }));

                    // Send to server
                    debouncedSaveOrder(itemsWithNewOrder);
                }}
            >
                <Droppable droppableId="privacy-sections" direction="vertical">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
}