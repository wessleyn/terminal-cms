'use client';

import { ActionIcon, Button, Card, ColorPicker, Container, Flex, Group, Paper, Stack, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconCheck, IconEdit, IconEye, IconLayoutList, IconTrash, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteCategory } from '../../../_actions/deleteCategory';
import { CategoryDetail as CategoryDetailType } from '../_actions/fetchCategoryById';
import { updateCategory } from '../_actions/updateCategory';
import classes from './CategoryDetail.module.css';

interface CategoryDetailProps {
    category: CategoryDetailType;
    initialEditMode?: boolean;
}

export default function CategoryDetail({ category, initialEditMode = false }: CategoryDetailProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(initialEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentSlug, setCurrentSlug] = useState(() =>
        category.name ? category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : ''
    );

    const form = useForm({
        initialValues: {
            name: category.name,
            description: category.description,
            color: category.color,
        },
        validate: {
            name: (value) => (!value || value.length < 2 ? 'Name must be at least 2 characters' : null),
            color: (value) => (!value ? 'Please select a color' : null),
        },
    });

    // Use ref to keep track of previous category values to avoid unnecessary updates
    const categoryRef = useRef({
        name: category.name,
        description: category.description,
        color: category.color
    });

    // Create a stable reference for form.setValues function to avoid dependency issues
    const setFormValues = useCallback((values: typeof form.values) => {
        form.setValues(values);
    }, [form]);

    // Update form values if category changes
    useEffect(() => {
        const currentCategory = categoryRef.current;
        if (
            currentCategory.name !== category.name ||
            currentCategory.description !== category.description ||
            currentCategory.color !== category.color
        ) {
            // Update the ref first
            categoryRef.current = {
                name: category.name,
                description: category.description,
                color: category.color
            };

            // Then update the form using the stable reference
            setFormValues({
                name: category.name,
                description: category.description,
                color: category.color,
            });
        }
    }, [category, setFormValues]);

    // Update slug when name changes
    useEffect(() => {
        if (isEditing) {
            const newSlug = form.values.name
                ? form.values.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                : '';
            setCurrentSlug(newSlug);
        }
    }, [form.values.name, isEditing]);

    // Update edit mode if initialEditMode changes
    useEffect(() => {
        setIsEditing(initialEditMode);
    }, [initialEditMode]);

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
            router.replace(`/blog/categories/${category.id}?edit=true`, { scroll: false });
        }
    };

    const cancelEdit = () => {
        form.reset();
        setIsEditing(false);
        router.replace(`/blog/categories/${category.id}`, { scroll: false });
    };

    const handleSave = async () => {
        const validation = form.validate();
        if (validation.hasErrors) return;

        setIsSubmitting(true);

        try {
            const result = await updateCategory({
                id: category.id,
                name: form.values.name,
                description: form.values.description,
                color: form.values.color,
            });

            if (result.success) {
                notifications.show({
                    title: 'Success',
                    message: result.message || 'Category updated successfully',
                    color: 'green',
                    icon: <IconCheck size={16} />,
                });
                setIsEditing(false);
                router.replace(`/blog/categories/${category.id}`, { scroll: false });
                router.refresh();
            } else {
                notifications.show({
                    title: 'Error',
                    message: result.message || 'Failed to update category',
                    color: 'red',
                    icon: <IconX size={16} />,
                });
            }
        } catch (error) {
            console.error('Error updating category:', error);
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred',
                color: 'red',
                icon: <IconX size={16} />,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDeleteModal = () => {
        // If category has no posts, confirm simple deletion
        if (category.postCount === 0) {
            modals.openConfirmModal({
                title: 'Delete Category',
                centered: true,
                children: (
                    <Text size="sm">
                        Are you sure you want to delete the category &quot;{category.name}&quot;?
                    </Text>
                ),
                labels: { confirm: 'Delete Category', cancel: 'Cancel' },
                confirmProps: { color: 'red' },
                onConfirm: handleDelete,
            });
            return;
        }

        // Show warning for categories with posts
        modals.openConfirmModal({
            title: 'Delete Category',
            centered: true,
            children: (
                <Text size="sm">
                    <Text span fw={600} c="red">Warning:</Text> This category contains {category.postCount} posts.
                    Posts will be moved to another category. Are you sure you want to delete &quot;{category.name}&quot;?
                </Text>
            ),
            labels: { confirm: 'Delete Category', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: handleDelete,
        });
    };

    const handleDelete = async () => {
        const notificationId = notifications.show({
            id: `delete-category-${category.id}`,
            loading: true,
            title: 'Deleting category',
            message: `Deleting "${category.name}"...`,
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const result = await deleteCategory(category.id);

            if (result.success) {
                notifications.update({
                    id: notificationId,
                    color: 'green',
                    title: 'Success',
                    message: result.message,
                    icon: <IconCheck size={16} />,
                    loading: false,
                    autoClose: 5000,
                });
                router.push('/blog/categories');
                router.refresh();
            } else {
                notifications.update({
                    id: notificationId,
                    color: 'red',
                    title: 'Error',
                    message: result.message,
                    icon: <IconX size={16} />,
                    loading: false,
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            notifications.update({
                id: notificationId,
                color: 'red',
                title: 'Error',
                message: 'An unexpected error occurred',
                icon: <IconX size={16} />,
                loading: false,
                autoClose: 5000,
            });
        }
    };

    // Helper function to generate slug from name
    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    const webPublicUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://localhost:3000';

    return (
        <Container fluid px="md" pt="md">
            <Group mb="md">
                <Button
                    leftSection={<IconArrowLeft size={16} />}
                    variant="subtle"
                    component={Link}
                    href="/blog/categories"
                >
                    Back to Categories
                </Button>
            </Group>

            <Paper withBorder p="xl" radius="md" className={classes.categoryContainer}>
                <Flex justify="space-between" align="center" mb="xl" wrap="wrap">
                    <Title order={3}>Category Details</Title>
                    <Group gap="xs">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="light"
                                    color="red"
                                    onClick={cancelEdit}
                                    size="sm"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="light"
                                    color="green"
                                    leftSection={<IconCheck size={16} />}
                                    onClick={handleSave}
                                    loading={isSubmitting}
                                    size="sm"
                                >
                                    Save
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="light"
                                color="blue"
                                leftSection={<IconEdit size={16} />}
                                onClick={toggleEdit}
                                size="sm"
                            >
                                Edit
                            </Button>
                        )}
                        <Tooltip label="Delete Category" position="bottom" withArrow>
                            <ActionIcon
                                color="red"
                                variant="light"
                                size="lg"
                                onClick={openDeleteModal}
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Flex>

                <div className={classes.categoryContent}>
                    {isEditing ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <Stack gap="md">
                                <TextInput
                                    label="Category Name"
                                    placeholder="Enter category name"
                                    required
                                    onChange={(e) => {
                                        form.setFieldValue('name', e.currentTarget.value);
                                        setCurrentSlug(generateSlug(e.currentTarget.value));
                                    }}
                                    value={form.values.name}
                                    error={form.errors.name}
                                />

                                <TextInput
                                    label="Slug"
                                    placeholder="Auto-generated from name"
                                    disabled
                                    value={currentSlug}
                                    description="Slug is automatically generated from the category name"
                                />

                                <TextInput
                                    label="Description"
                                    placeholder="Enter category description"
                                    {...form.getInputProps('description')}
                                />

                                <div>
                                    <Text size="sm" fw={500} mb="xs">Color</Text>
                                    <ColorPicker
                                        format="hex"
                                        swatches={[
                                            '#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2',
                                            '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e',
                                            '#fab005', '#fd7e14'
                                        ]}
                                        {...form.getInputProps('color')}
                                    />
                                </div>
                            </Stack>
                        </form>
                    ) : (
                        <Stack gap="md">
                            <Group align="flex-start">
                                <div className={classes.categoryInfoSection}>
                                    <Text size="sm" c="dimmed" fw={500}>Category Name</Text>
                                    <Group gap="xs">
                                        <div
                                            className={classes.colorBadge}
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <Text fw={500} size="lg">{category.name}</Text>
                                    </Group>
                                </div>

                                <div className={classes.categoryInfoSection}>
                                    <Text size="sm" c="dimmed" fw={500}>Slug</Text>
                                    <Text>{category.slug}</Text>
                                </div>
                            </Group>

                            <div className={classes.categoryInfoSection}>
                                <Text size="sm" c="dimmed" fw={500}>Description</Text>
                                <Text>{category.description || 'No description provided'}</Text>
                            </div>

                            <Group align="flex-start">
                                <div className={classes.categoryInfoSection}>
                                    <Text size="sm" c="dimmed" fw={500}>Created</Text>
                                    <Text>{new Date(category.createdAt).toLocaleDateString()}</Text>
                                </div>

                                <div className={classes.categoryInfoSection}>
                                    <Text size="sm" c="dimmed" fw={500}>Last Updated</Text>
                                    <Text>{new Date(category.updatedAt).toLocaleDateString()}</Text>
                                </div>
                            </Group>

                            <div className={classes.categoryInfoSection}>
                                <Text size="sm" c="dimmed" fw={500}>Used In</Text>
                                <Text>{category.postCount} {category.postCount === 1 ? 'post' : 'posts'}</Text>
                            </div>

                            <Group mt="lg">
                                <Button
                                    component={Link}
                                    href={`${webPublicUrl}/blog/category/${category.slug}`}
                                    target="_blank"
                                    leftSection={<IconEye size={16} />}
                                    variant="outline"
                                    size="sm"
                                >
                                    View in Blog
                                </Button>

                                <Button
                                    component={Link}
                                    href={`/blog/posts?category=${category.slug}`}
                                    leftSection={<IconLayoutList size={16} />}
                                    variant="outline"
                                    size="sm"
                                >
                                    View Related Posts
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </div>

                {category.postCount > 0 && (
                    <Card withBorder radius="md" mt="xl" className={classes.relatedPostsCard}>
                        <Card.Section withBorder p="md">
                            <Group justify="space-between">
                                <Text fw={500}>Related Posts</Text>
                                <Link href={`/blog/posts?category=${category.slug}`} className={classes.viewAllLink}>
                                    View All
                                </Link>
                            </Group>
                        </Card.Section>
                        <Card.Section p="md">
                            <Text c="dimmed" size="sm">This category is used in {category.postCount} posts.</Text>
                        </Card.Section>
                    </Card>
                )}
            </Paper>
        </Container>
    );
}
