import { Card, Container, Group, SimpleGrid, Skeleton } from '@mantine/core';

export default function TagsLoading() {
    return (
        <Container fluid px="md">
            {/* Page header with filters */}
            <Group justify="space-between" mb="lg">
                <Skeleton height={32} width={180} radius="md" />
                <Group>
                    <Skeleton height={36} width={240} radius="md" />
                    <Skeleton height={36} width={120} radius="md" />
                </Group>
            </Group>

            {/* Tags grid */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {Array(9).fill(0).map((_, index) => (
                    <Card key={index} radius="md" withBorder p="md" style={{ opacity: 1 - index * 0.05 }}>
                        {/* Tag header */}
                        <Group justify="space-between" mb="md">
                            <Group>
                                <Skeleton height={24} circle style={{ width: 24 }} />
                                <Skeleton height={24} width={120} radius="sm" />
                            </Group>
                            <Skeleton height={22} width={60} radius="xl" />
                        </Group>

                        {/* Tag description */}
                        <Skeleton height={16} mb={8} />
                        <Skeleton height={16} width="85%" mb={8} />
                        <Skeleton height={16} width="70%" mb={16} />

                        {/* Posts count and actions */}
                        <Group justify="space-between" mt="auto">
                            <Group>
                                <Skeleton height={18} width={80} radius="sm" />
                            </Group>
                            <Group>
                                <Skeleton height={24} circle style={{ width: 24 }} />
                                <Skeleton height={24} circle style={{ width: 24 }} />
                            </Group>
                        </Group>
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
}