'use client';

import { ActionIcon, Badge, Group, Paper, Table, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteCategory } from '../_actions/deleteCategory';
import { CategoryWithPostCount } from '../_actions/fetchAllCategories';

interface CategoriesListProps {
    categories: CategoryWithPostCount[];
}

export default function CategoriesList({ categories }: CategoriesListProps) {
    const router = useRouter();

    // Handle delete category action
    const handleDelete = async (categoryId: string, categoryName: string, postCount: number) => {
        // Show warning if category has posts
        if (postCount > 0) {
            modals.openConfirmModal({
                title: 'Delete Category',
                children: (
                    <Text size="sm">
                        <Text span fw={600} c="red">Warning:</Text> This category contains {postCount} posts.
                        Deleting it will leave these posts without a category.
                        Are you sure you want to delete &quot;{categoryName}&quot;?
                    </Text>
                ),
                labels: { confirm: 'Delete', cancel: 'Cancel' },
                confirmProps: { color: 'red' },
                onConfirm: () => confirmDelete(categoryId, categoryName),
            });
        } else {
            // No posts, proceed with delete confirmation
            modals.openConfirmModal({
                title: 'Delete Category',
                children: <Text size="sm">Are you sure you want to delete &quot;{categoryName}&quot;?</Text>,
                labels: { confirm: 'Delete', cancel: 'Cancel' },
                confirmProps: { color: 'red' },
                onConfirm: () => confirmDelete(categoryId, categoryName),
            });
        }
    };

    // Execute the delete operation
    const confirmDelete = async (categoryId: string, categoryName: string) => {
        const notificationId = `delete-category-${categoryId}`;
        notifications.show({
            id: notificationId,
            title: 'Deleting category',
            message: `Deleting "${categoryName}"...`,
            loading: true,
            autoClose: false,
        });

        try {
            const result = await deleteCategory(categoryId);

            if (result.success) {
                notifications.update({
                    id: notificationId,
                    title: 'Success',
                    message: result.message,
                    color: 'green',
                    loading: false,
                    autoClose: 3000,
                });
                router.refresh();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            notifications.update({
                id: notificationId,
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to delete category',
                color: 'red',
                loading: false,
                autoClose: 3000,
            });
        }
    };

    // Handle edit action
    const handleEdit = (categoryId: string) => {
        router.push(`/blog/categories/${categoryId}?edit=true`);
    };

    // If no categories, show empty state
    if (categories.length === 0) {
        return (
            <Paper p="xl" withBorder>
                <Text ta="center" c="dimmed">No categories found. Create a new category to get started.</Text>
            </Paper>
        );
    }

    // Render the categories table
    return (
        <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Slug</Table.Th>
                    <Table.Th>Posts</Table.Th>
                    <Table.Th style={{ width: 100 }}>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {categories.map((category) => (
                    <Table.Tr key={category.id}>
                        <Table.Td>
                            <Group gap="xs">
                                <Badge
                                    color={category.color}
                                    variant="dot"
                                />
                                <Text fw={500}>{category.name}</Text>
                            </Group>
                        </Table.Td>
                        <Table.Td>{category.slug}</Table.Td>
                        <Table.Td>{category.postCount}</Table.Td>
                        <Table.Td>
                            <Group gap="xs">
                                <Tooltip label="View on site">
                                    <ActionIcon
                                        component={Link}
                                        href={`/blog/category/${category.slug}`}
                                        target="_blank"
                                        variant="subtle"
                                    >
                                        <IconEye size={16} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Edit">
                                    <ActionIcon
                                        onClick={() => handleEdit(category.id)}
                                        variant="subtle"
                                        color="blue"
                                    >
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label="Delete">
                                    <ActionIcon
                                        onClick={() => handleDelete(category.id, category.name, category.postCount)}
                                        variant="subtle"
                                        color="red"
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
    );
}
