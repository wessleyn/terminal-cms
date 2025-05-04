'use client';

import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import {
    ActionIcon,
    Button,
    Group,
    Stack,
    TextInput,
    Tooltip,
    notifications,
    useDebouncedCallback,
    useListState
} from '@repo/ui/components/mantine';
import { SocialIcon } from '@repo/ui/components/shared';
import { detectPlatform } from '@repo/ui/utils/socialPlatform';
import {
    IconGripVertical,
    IconPlus,
    IconTrash
} from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { addSocialLink } from '../_actions/addSocialLink';
import { deleteSocialLink } from '../_actions/deleteSocialLink';
import { reorderSocialLinks } from '../_actions/reorderSocialLinks';
import { updateSocialLink } from '../_actions/updateSocialLink';

type SocialLink = {
    id: string;
    platform: string;
    url: string;
    order?: number;
};

interface DraggableSocialLinksProps {
    initialLinks: SocialLink[];
}

export function DraggableSocialLinks({ initialLinks }: DraggableSocialLinksProps) {
    // Initialize with sorted links if order is present, otherwise use the original order
    const sortedLinks = [...initialLinks].sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        return 0;
    });

    const [links, handlers] = useListState<SocialLink>(sortedLinks);
    // Track detected platforms for each link
    const [detectedPlatforms, setDetectedPlatforms] = useState<Record<string, string>>(
        Object.fromEntries(sortedLinks.map(link => [link.id, detectPlatform(link.url)]))
    );

    // Handle the reordering of links
    const debouncedSaveOrder = useDebouncedCallback((items: SocialLink[]) => {
        (async () => {
            try {
                // Prepare links with their new order
                const linksWithOrder = items.map((item, index) => ({
                    id: item.id,
                    order: index
                }));

                const result = await reorderSocialLinks(linksWithOrder);

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
                console.error(error);
                notifications.show({
                    title: 'Error',
                    message: 'An unexpected error occurred',
                    color: 'red',
                });
            }
        })();
    }, 1000);

    // Handle URL change for a social link with platform detection
    const handleUrlChange = useCallback((id: string, url: string) => {
        const linkIndex = links.findIndex(link => link.id === id);
        if (linkIndex !== -1) {
            handlers.setItemProp(linkIndex, 'url', url);

            // Detect platform from URL
            const platform = detectPlatform(url);
            setDetectedPlatforms(prev => ({
                ...prev,
                [id]: platform
            }));

            // Debounced save
            const debouncedSave = setTimeout(async () => {
                const result = await updateSocialLink(id, url, platform);

                if (result.success) {
                    // If platform has changed, update the platform in the local state
                    if (platform !== 'other' && links[linkIndex] && platform !== links[linkIndex].platform) {
                        handlers.setItemProp(linkIndex, 'platform', platform);
                    }
                } else {
                    notifications.show({
                        title: 'Error',
                        message: result.error || 'Failed to update social link',
                        color: 'red',
                    });
                }
            }, 1000);

            return () => clearTimeout(debouncedSave);
        }
    }, [links, handlers]);

    // Handle adding a new social link
    const handleAddSocialLink = async () => {
        // Default to a generic platform if needed
        const result = await addSocialLink('other', 'https://');

        if (result.success && result.data) {
            const newLink: SocialLink = {
                id: result.data.id,
                platform: 'other',
                url: 'https://',
                order: links.length
            };

            handlers.append(newLink);

            // Initialize detected platform
            setDetectedPlatforms(prev => ({
                ...prev,
                [newLink.id]: 'other'
            }));

            notifications.show({
                title: 'Success',
                message: 'New social link added',
                color: 'green',
            });
        } else {
            notifications.show({
                title: 'Error',
                message: result.error || 'Failed to add social link',
                color: 'red',
            });
        }
    };

    // Handle deleting a social link
    const handleDeleteSocialLink = async (id: string, index: number) => {
        const result = await deleteSocialLink(id);

        if (result.success) {
            handlers.remove(index);

            // Remove from detected platforms
            setDetectedPlatforms(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });

            notifications.show({
                title: 'Success',
                message: 'Social link removed',
                color: 'green',
            });
        } else {
            notifications.show({
                title: 'Error',
                message: result.error || 'Failed to remove social link',
                color: 'red',
            });
        }
    };

    return (
        <Stack gap="md">
            <Button
                leftSection={<IconPlus size={14} />}
                variant="light"
                onClick={handleAddSocialLink}
                size="sm"
            >
                Add Social Link
            </Button>

            <DragDropContext
                onDragEnd={({ destination, source }: DropResult) => {
                    // Do nothing if dropped outside or at the same position
                    if (!destination ||
                        (destination.droppableId === source.droppableId &&
                            destination.index === source.index)) {
                        return;
                    }

                    // Update the local state with the new order
                    handlers.reorder({ from: source.index, to: destination.index });

                    // Update the order in the database
                    debouncedSaveOrder(
                        links.map((item: SocialLink, index: number) => ({
                            ...item,
                            order: index
                        }))
                    );
                }}
            >
                <Droppable droppableId="social-links">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {links.map((link, index) => (
                                <Draggable key={link.id} index={index} draggableId={link.id}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={{
                                                marginBottom: '10px',
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            <Group align="center" wrap="nowrap">
                                                <div {...provided.dragHandleProps}>
                                                    <IconGripVertical size={18} style={{ cursor: 'grab' }} />
                                                </div>

                                                {/* Platform icon based on detected/saved platform */}
                                                <Tooltip
                                                    label={detectedPlatforms[link.id] !== 'other'
                                                        ? `Detected: ${detectedPlatforms[link.id]}`
                                                        : 'Unknown platform'}
                                                    position="top"
                                                >
                                                    <div>
                                                        <SocialIcon
                                                            platform={detectedPlatforms[link.id] || link.platform}
                                                            size={18}
                                                        />
                                                    </div>
                                                </Tooltip>

                                                <TextInput
                                                    value={link.url}
                                                    onChange={(e) => handleUrlChange(link.id, e.currentTarget.value)}
                                                    placeholder={`Enter social media URL`}
                                                    style={{ flexGrow: 1 }}
                                                />

                                                <ActionIcon
                                                    color="red"
                                                    variant="subtle"
                                                    onClick={() => handleDeleteSocialLink(link.id, index)}
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Group>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Stack>
    );
}