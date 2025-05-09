'use client';

import { ActionIcon, Group, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconMail, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import deleteUser from '../_actions/deleteUser';

interface UserActionsProps {
    userId: string;
    userName: string | null;
    email: string;
    onDelete?: () => void;
}

export function UserActions({ userId, userName, email, onDelete }: UserActionsProps) {
    const router = useRouter();
    const displayName = userName || 'this user';

    const handleDelete = async () => {
        // Show notification that deletion is in progress
        const notificationId = notifications.show({
            id: `delete-user-${userId}`,
            loading: true,
            title: 'Deleting user',
            message: `Deleting ${displayName}...`,
            autoClose: false,
            withCloseButton: false,
        });

        try {
            // Call the server action to delete the user
            await deleteUser(userId);

            // Show success notification
            notifications.update({
                id: notificationId,
                color: 'green',
                title: 'User deleted',
                message: `${displayName} has been deleted successfully`,
                icon: <IconCheck size="1rem" />,
                loading: false,
                autoClose: 5000,
            });

            // Call the onDelete callback if provided
            if (onDelete) {
                onDelete();
            }

            // Refresh the router to update the UI
            router.refresh();
        } catch (error) {
            // Show error notification
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Error',
                message: `Failed to delete ${displayName}. Please try again.`,
                icon: <IconX size="1rem" />,
                loading: false,
                autoClose: 5000,
            });
            console.error('Error deleting user:', error);
        }
    };

    const openDeleteModal = () => {
        modals.openConfirmModal({
            title: `Delete User`,
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete {displayName}? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete User', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: handleDelete,
        });
    };

    return (
        <Group gap={0} justify="flex-end" onClick={(e) => e.stopPropagation()}>
            <ActionIcon
                variant="subtle"
                color="gray"
                onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${email}`;
                }}
            >
                <IconMail size={16} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
                variant="subtle"
                color="gray"
                onClick={(e) => {
                    e.stopPropagation();
                    // Use search parameter to set edit mode
                    router.push(`/blog/users/${userId}?edit=true`);
                }}
            >
                <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
                variant="subtle"
                color="red"
                onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal();
                }}
            >
                <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
        </Group>
    );
}
