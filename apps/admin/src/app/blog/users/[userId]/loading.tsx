import { Container, Divider, Flex, Group, Paper, Skeleton, Stack, Title } from "@mantine/core";
import styles from "../_components/UserProfileDetail.module.css";

export default function UserProfileLoading() {
    return (
        <Container fluid px="md" pt="md">
            <Paper withBorder p="xl" radius="md" className={styles.profileContainer}>
                {/* Header section with title and action buttons */}
                <Flex justify="space-between" align="center" mb="xl" wrap="wrap">
                    <Title order={3}>User Profile</Title>
                    <Group gap="xs">
                        {/* Back to users button skeleton */}
                        <Skeleton height={36} width={120} radius="sm" />

                        {/* Edit button skeleton */}
                        <Skeleton height={36} width={80} radius="sm" />

                        {/* Delete action button skeleton */}
                        <Skeleton height={36} width={36} circle />
                    </Group>
                </Flex>

                <Flex gap="xl" wrap="wrap">
                    {/* Avatar and name section */}
                    <div className={styles.profileHeader}>
                        <Skeleton height={120} circle width={120} className={styles.avatar} />
                        <Stack gap={4} mt="md" align="center">
                            <Skeleton height={28} width={150} />
                            <Skeleton height={16} width={180} />
                        </Stack>
                    </div>

                    {/* User info grid */}
                    <div className={styles.profileDetails}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <Skeleton height={14} width={40} mb={6} />
                                <Skeleton height={20} width={180} />
                            </div>
                            <div className={styles.infoItem} style={{ marginLeft: '3rem' }}>
                                <Skeleton height={14} width={40} mb={6} />
                                <Skeleton height={20} width={100} />
                            </div>
                            <div className={styles.infoItem}>
                                <Skeleton height={14} width={60} mb={6} />
                                <Skeleton height={20} width={120} />
                            </div>
                            <div className={styles.infoItem}>
                                <Skeleton height={14} width={70} mb={6} />
                                <Skeleton height={20} width={150} />
                            </div>
                        </div>
                    </div>
                </Flex>

                <Divider my="lg" />

                {/* Comment metrics section */}
                <div className={styles.subscriptionSection}>
                    <Title order={5} mb="md">Comment Engagement</Title>
                    {[1, 2, 3].map(index => (
                        <Paper withBorder p="md" radius="md" mb="sm" key={index}>
                            <Group justify="apart">
                                <Skeleton height={16} width={150} />
                                <Skeleton height={20} width={30} />
                            </Group>
                        </Paper>
                    ))}
                </div>
            </Paper>
        </Container>
    );
}