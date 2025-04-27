'use client';

import { ActionIcon, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEye, IconTrash } from '@tabler/icons-react';
import classes from './ActionButtons.module.css';

interface ActionButtonsProps {
    onView: () => void;
    onDelete: () => void;
}

export default function ActionButtons({ onView, onDelete }: ActionButtonsProps) {
    const [opened, { open, close }] = useDisclosure(false);

    const handleDelete = () => {
        onDelete();
        close();
    };

    return (
        <>
            <Group gap="xs" wrap="nowrap" justify="flex-end">
                <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={onView}
                    className={classes.actionButton}
                    aria-label="View project"
                    size="lg"
                >
                    <IconEye size={20} />
                </ActionIcon>
                <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={open}
                    className={classes.actionButton}
                    aria-label="Delete project"
                    size="lg"
                >
                    <IconTrash size={20} />
                </ActionIcon>
            </Group>

            <Modal
                opened={opened}
                onClose={close}
                title="Confirm Deletion"
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
                classNames={{
                    title: classes.modalTitle,
                }}
            >
                <Text size="sm" mb="lg">
                    Are you sure you want to delete this project? This action cannot be undone.
                </Text>
                <Group justify="flex-end" mt="xl">
                    <ActionIcon
                        variant="outline"
                        color="gray"
                        onClick={close}
                        size="lg"
                        className={classes.modalButton}
                    >
                        Cancel
                    </ActionIcon>
                    <ActionIcon
                        variant="filled"
                        color="red"
                        onClick={handleDelete}
                        size="lg"
                        className={classes.modalButton}
                    >
                        Delete
                    </ActionIcon>
                </Group>
            </Modal>
        </>
    );
}