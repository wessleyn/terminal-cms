'use client';

import { ActionIcon, Button, Card, ColorPicker, Container, Flex, Group, Paper, SegmentedControl, Stack, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { BlogTagType } from '@repo/db';
import { IconArrowLeft, IconCheck, IconEdit, IconEye, IconEyeOff, IconLayoutList, IconTrash, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteTag } from '../_actions/deleteTag';
import { TagDetail as TagDetailType } from '../_actions/fetchTagById';
import { updateTag } from '../_actions/updateTag';
import classes from './TagDetail.module.css';

interface TagDetailProps {
    tag: TagDetailType;
    initialEditMode?: boolean;
}

export default function TagDetail({ tag, initialEditMode = false }: TagDetailProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(initialEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentSlug, setCurrentSlug] = useState(() =>
        tag.name ? tag.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : ''
    );

    const form = useForm({
        initialValues: {
            name: tag.name,
            description: tag.description,
            color: tag.color,
            type: tag.type,
        },
        validate: {
            name: (value) => (!value || value.length < 2 ? 'Name must be at least 2 characters' : null),
            color: (value) => (!value ? 'Please select a color' : null),
        },
    });

    // Use ref to keep track of previous tag values to avoid unnecessary updates
    const tagRef = useRef({
        name: tag.name,
        description: tag.description,
        color: tag.color,
        type: tag.type
    });

    // Create a stable reference for form.setValues function to avoid dependency issues
    const setFormValues = useCallback((values: typeof form.values) => {
        form.setValues(values);
    }, [form]);

    // Update form values if tag changes
    useEffect(() => {
        const currentTag = tagRef.current;
        if (
            currentTag.name !== tag.name ||
            currentTag.description !== tag.description ||
            currentTag.color !== tag.color ||
            currentTag.type !== tag.type
        ) {
            // Update the ref first
            tagRef.current = {
                name: tag.name,
                description: tag.description,
                color: tag.color,
                type: tag.type
            };

            // Then update the form using the stable reference
            setFormValues({
                name: tag.name,
                description: tag.description,
                color: tag.color,
                type: tag.type,
            });
        }
    }, [tag, setFormValues]); // Include setFormValues in dependencies

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
            router.replace(`/blog/tags/${tag.id}?edit=true`, { scroll: false });
        }
    };

    const cancelEdit = () => {
        form.reset();
        setIsEditing(false);
        router.replace(`/blog/tags/${tag.id}`, { scroll: false });
    };

    const handleSave = async () => {
        const validation = form.validate();
        if (validation.hasErrors) return;

        setIsSubmitting(true);

        try {
            const result = await updateTag({
                id: tag.id,
                name: form.values.name,
                description: form.values.description,
                color: form.values.color,
                type: form.values.type as BlogTagType,
            });

            if (result.success) {
                notifications.show({
                    title: 'Success',
                    message: result.message || 'Tag updated successfully',
                    color: 'green',
                    icon: <IconCheck size={16} />,
                });
                setIsEditing(false);
                router.replace(`/blog/tags/${tag.id}`, { scroll: false });
                router.refresh();
            } else {
                notifications.show({
                    title: 'Error',
                    message: result.message || 'Failed to update tag',
                    color: 'red',
                    icon: <IconX size={16} />,
                });
            }
        } catch (error) {
            console.error('Error updating tag:', error);
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
        // If tag has no posts, delete immediately without confirmation
        if (tag.postCount === 0) {
            handleDelete();
            return;
        }

        // Show confirmation dialog with warning for tags with posts
        modals.openConfirmModal({
            title: 'Delete Tag',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete the tag &quot;{tag.name}&quot;?
                    {tag.postCount > 0 && (
                        <Text span c="red" fw={500}> This tag is used in {tag.postCount} posts. Deleting it will remove this tag from all posts.</Text>
                    )}
                </Text>
            ),
            labels: { confirm: 'Delete Tag', cancel: 'Cancel' },
            confirmProps: {
                color: 'red',
                // Removed the disabled prop so users can delete tags with posts
            },
            onConfirm: handleDelete,
        });
    };

    const handleDelete = async () => {
        const notificationId = notifications.show({
            id: `delete-tag-${tag.id}`,
            loading: true,
            title: 'Deleting tag',
            message: `Deleting &quot;${tag.name}&quot;...`,
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const result = await deleteTag(tag.id);

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
                router.push('/blog/tags');
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
            console.error('Error deleting tag:', error);
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

    // Helper function to determine if tag is viewable in public blog
    const isPublicTag = tag.type === 'BLOG';

    return (
        <Container fluid px="md" pt="md">
            <Group mb="md">
                <Button
                    leftSection={<IconArrowLeft size={16} />}
                    variant="subtle"
                    component={Link}
                    href="/blog/tags"
                >
                    Back to Tags
                </Button>
            </Group>

            <Paper withBorder p="xl" radius="md" className={classes.tagContainer}>
                <Flex justify="space-between" align="center" mb="xl" wrap="wrap">
                    <Title order={3}>Tag Details</Title>
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
                        <Tooltip label="Delete Tag" position="bottom" withArrow>
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

                <div className={classes.tagContent}>
                    {isEditing ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <Stack gap="md">
                                <TextInput
                                    label="Tag Name"
                                    placeholder="Enter tag name"
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
                                    description="Slug is automatically generated from the tag name"
                                />

                                <TextInput
                                    label="Description"
                                    placeholder="Enter tag description"
                                    {...form.getInputProps('description')}
                                />

                                <div>
                                    <Text size="sm" fw={500} mb="xs">Tag Type</Text>
                                    <SegmentedControl
                                        data={[
                                            { label: 'Public', value: 'BLOG' },
                                            { label: 'Internal', value: 'INTERNAL' },
                                        ]}
                                        {...form.getInputProps('type')}
                                    />
                                </div>

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
                                <div className={classes.tagInfoSection}>
                                    <Text size="sm" c="dimmed" fw={500}>Tag Name</Text>
                                    <Group gap="xs">
                                        <div
                                            className={classes.colorBadge}
                                            style={{ backgroundColor: tag.color }}
                                        />
                                        <Text fw={500} size="lg">{tag.name}</Text>
                                    </Group>
                                </div>

                                <div className={classes.tagInfoSection}>
                                    <Text size="sm" c="dimmed" fw={500}>Slug</Text>
                                    <Text>{tag.slug}</Text>
                                </div>
                            </Group>

                            <div className={classes.tagInfoSection}>
                                <Text size="sm" c="dimmed" fw={500}>Description</Text>
                                <Text>{tag.description || 'No description provided'}</Text>
                            </div>

                            <Group align="flex-start">
                                <div className={classes.tagInfoSection}>
                                    <Text size="sm" c="dimmed" fw={500}>Type</Text>
                                    <Text>{tag.type === 'BLOG' ? 'Public' : 'Internal'}</Text>
                                </div>

                                <div className={classes.tagInfoSection}>
                                    <Text size="sm" c="dimmed" fw={500}>Created</Text>
                                    <Text>{new Date(tag.createdAt).toLocaleDateString()}</Text>
                                </div>

                                <div className={classes.tagInfoSection}>
                                    <Text size="sm" c="dimmed" fw={500}>Last Updated</Text>
                                    <Text>{new Date(tag.updatedAt).toLocaleDateString()}</Text>
                                </div>
                            </Group>

                            <div className={classes.tagInfoSection}>
                                <Text size="sm" c="dimmed" fw={500}>Used In</Text>
                                <Text>{tag.postCount} {tag.postCount === 1 ? 'post' : 'posts'}</Text>
                            </div>

                            <Group mt="lg">
                                {isPublicTag ? (
                                    <Button
                                        component={Link}
                                        href={`/blog/tag/${tag.slug}`}
                                        target="_blank"
                                        leftSection={<IconEye size={16} />}
                                        variant="outline"
                                        size="sm"
                                    >
                                        View in Blog
                                    </Button>
                                ) : (
                                    <Tooltip label="Internal tags are not visible in the public blog">
                                        <Button
                                            leftSection={<IconEyeOff size={16} />}
                                            variant="outline"
                                            size="sm"
                                            color="gray"
                                            disabled
                                            style={{ opacity: 0.6, textDecoration: 'line-through' }}
                                        >
                                            Not Public
                                        </Button>
                                    </Tooltip>
                                )}

                                <Button
                                    component={Link}
                                    href={`/blog/posts?tag=${tag.slug}`}
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

                {tag.postCount > 0 && (
                    <Card withBorder radius="md" mt="xl" className={classes.relatedPostsCard}>
                        <Card.Section withBorder p="md">
                            <Group justify="space-between">
                                <Text fw={500}>Related Posts</Text>
                                <Link href={`/blog/posts?tag=${tag.slug}`} className={classes.viewAllLink}>
                                    View All
                                </Link>
                            </Group>
                        </Card.Section>
                        <Card.Section p="md">
                            <Text c="dimmed" size="sm">This tag is used in {tag.postCount} posts.</Text>
                        </Card.Section>
                    </Card>
                )}
            </Paper>
        </Container>
    );
}
