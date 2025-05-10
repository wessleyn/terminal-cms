"use client";

import { ActionIcon, Avatar, Button, Card, Container, Divider, Flex, Group, Paper, Select, Stack, Text, TextInput, Title, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import deleteUser from "../../../_actions/deleteUser";
import { UserDetail } from "../../../_actions/fetchUserDetails";
import { updateUser } from "../../../_actions/updateUser";
import styles from "./UserProfileDetail.module.css";

interface UserProfileDetailProps {
    user: UserDetail;
    initialEditMode?: boolean;
}

export default function UserProfileDetail({ user, initialEditMode = false }: UserProfileDetailProps) {
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(initialEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState({
        name: user.name || "",
        email: user.email,
        role: user.role,
    });

    useEffect(() => {
        setIsEditing(initialEditMode);
    }, [initialEditMode]);

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
            router.replace(`/blog/users/${user.id}?edit=true`, { scroll: false });
        }
    };

    const cancelEdit = () => {
        setUserData({
            name: user.name || "",
            email: user.email,
            role: user.role,
        });
        setIsEditing(false);
        router.replace(`/blog/users/${user.id}`, { scroll: false });
    };

    const handleSave = async () => {
        setIsSubmitting(true);

        try {
            const result = await updateUser({
                id: user.id,
                name: userData.name || null,
                email: userData.email,
                role: userData.role,
            });

            if (result.success) {
                notifications.show({
                    title: "Success",
                    message: "User information updated successfully",
                    color: "green",
                    icon: <IconCheck />,
                });
                setIsEditing(false);
                router.replace(`/blog/users/${user.id}`, { scroll: false });
                router.refresh();
            } else {
                notifications.show({
                    title: "Error",
                    message: result.message || "Failed to update user information",
                    color: "red",
                    icon: <IconX />,
                });
            }
        } catch (error) {
            notifications.show({
                title: "Error",
                message: "An unexpected error occurred",
                color: "red",
                icon: <IconX />,
            });
            console.error("Error updating user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        // Show notification that deletion is in progress
        const notificationId = notifications.show({
            id: `delete-user-${user.id}`,
            loading: true,
            title: "Deleting user",
            message: `Deleting ${user.name || "user"}...`,
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await deleteUser(user.id);

            // Show success notification
            notifications.update({
                id: notificationId,
                color: "green",
                title: "User deleted",
                message: `${user.name || "User"} has been deleted successfully`,
                icon: <IconCheck size="1rem" />,
                loading: false,
                autoClose: 5000,
            });

            // Navigate back to users list
            router.push("/blog/users");
            router.refresh();
        } catch (error) {
            // Show error notification
            notifications.update({
                id: notificationId,
                color: "red",
                title: "Error",
                message: `Failed to delete user. Please try again.`,
                icon: <IconX size="1rem" />,
                loading: false,
                autoClose: 5000,
            });
            console.error("Error deleting user:", error);
        }
    };

    const openDeleteModal = () => {
        modals.openConfirmModal({
            title: "Delete User",
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete {user.name || "this user"}? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: "Delete User", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: handleDelete,
        });
    };

    return (
        <Container fluid px="md" pt="md">
            <Paper withBorder p="xl" radius="md" className={styles.profileContainer}>
                <Flex justify="space-between" align="center" mb="xl" wrap="wrap">
                    <Title order={3}>User Profile</Title>
                    <Group gap="xs">
                        <Button
                            variant="light"
                            color="gray"
                            onClick={() => router.push('/blog/users')}
                            size="sm"
                        >
                            Back to Users
                        </Button>
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
                        <Tooltip label="Delete User" position="bottom" withArrow>
                            <ActionIcon color="red" variant="light" size="lg" onClick={openDeleteModal}>
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Flex>

                <Flex gap="xl" wrap="wrap">
                    <div className={styles.profileHeader}>
                        <Avatar
                            src={user.avatar}
                            size={120}
                            radius={60}
                            className={styles.avatar}
                            color="blue"
                        >
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </Avatar>
                        <Stack gap={4} mt="md">
                            {isEditing ? (
                                <TextInput
                                    label="Name"
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.currentTarget.value })}
                                />
                            ) : (
                                <>
                                    <Text size="lg" fw={700} ta="center">
                                        {user.name || "Unnamed User"}
                                    </Text>
                                    <Text size="sm" color="dimmed" ta="center">
                                        {user.email}
                                    </Text>
                                </>
                            )}
                        </Stack>
                    </div>

                    <div className={styles.profileDetails}>
                        <div className={styles.infoGrid}>
                            {isEditing ? (
                                <>
                                    <div className={styles.infoItem}>
                                        <TextInput
                                            label="Email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.currentTarget.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <Select
                                            label="Role"
                                            value={userData.role}
                                            onChange={(value) => setUserData({ ...userData, role: value || "user" })}
                                            data={[
                                                { value: "admin", label: "Admin" },
                                                { value: "editor", label: "Editor" },
                                                { value: "author", label: "Author" },
                                                { value: "contributor", label: "Contributor" },
                                                { value: "user", label: "User" },
                                            ]}
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.infoItem}>
                                        <Text size="sm" color="dimmed" fw={500}>Email</Text>
                                        <Text>{user.email}</Text>
                                    </div>
                                    <div className={styles.infoItem} style={{ marginLeft: '3rem' }}>
                                        <Text size="sm" color="dimmed" fw={500}>Role</Text>
                                        <Text>{user.role}</Text>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <Text size="sm" color="dimmed" fw={500}>Created</Text>
                                        <Text>{user.formattedCreatedAt}</Text>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <Text size="sm" color="dimmed" fw={500}>Last Active</Text>
                                        <Text>{user.lastActive}</Text>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Flex>

                <Divider my="lg" />

                <div className={styles.subscriptionSection}>
                    <Title order={5} mb="md">Comment Engagement</Title>
                    <Card withBorder radius="md" mb="sm">
                        <Group justify="apart">
                            <Text>Total comments</Text>
                            <Text fw={700}>{user.commentMetrics.totalComments}</Text>
                        </Group>
                    </Card>
                    <Card withBorder radius="md" mb="sm">
                        <Group justify="apart">
                            <Text>Comments in last 7 days</Text>
                            <Text fw={700}>{user.commentMetrics.lastWeekComments}</Text>
                        </Group>
                    </Card>
                    <Card withBorder radius="md" mb="sm">
                        <Group justify="apart">
                            <Text>Average comments per month</Text>
                            <Text fw={700}>{user.commentMetrics.avgCommentsPerMonth}</Text>
                        </Group>
                    </Card>
                </div>
            </Paper>
        </Container>
    );
}
