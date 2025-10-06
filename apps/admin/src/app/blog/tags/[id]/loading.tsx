import { Card, Container, Divider, Group, Skeleton, Stack } from '@mantine/core';

export default function TagDetailLoading() {
    return (
        <Container fluid px="md" pt="md">
            {/* Back button */}
            <Group mb="md">
                <Skeleton height={36} width={120} radius="sm" />
            </Group>

            <Card p="lg" radius="md" withBorder>
                {/* Tag header with title and actions */}
                <Group justify="space-between" mb="xl">
                    <Skeleton height={38} width={220} radius="md" />
                    <Group>
                        <Skeleton height={36} width={100} radius="sm" />
                        <Skeleton height={36} width={100} radius="sm" />
                    </Group>
                </Group>

                {/* Tag details form */}
                <Stack gap="md" mb="xl">
                    {/* Name field */}
                    <div>
                        <Skeleton height={20} width={80} radius="sm" mb="sm" />
                        <Skeleton height={42} radius="md" />
                    </div>

                    {/* Slug field */}
                    <div>
                        <Skeleton height={20} width={80} radius="sm" mb="sm" />
                        <Skeleton height={42} radius="md" />
                    </div>

                    {/* Description field */}
                    <div>
                        <Skeleton height={20} width={120} radius="sm" mb="sm" />
                        <Skeleton height={80} radius="md" />
                    </div>

                    {/* Color picker */}
                    <div>
                        <Skeleton height={20} width={100} radius="sm" mb="sm" />
                        <Group align="flex-start">
                            <Skeleton height={120} width={220} radius="md" />
                            <Skeleton height={42} width={42} radius="md" />
                        </Group>
                    </div>

                    {/* Tag type selector */}
                    <div>
                        <Skeleton height={20} width={100} radius="sm" mb="sm" />
                        <Skeleton height={42} width={220} radius="md" />
                    </div>
                </Stack>

                <Divider my="lg" />

                {/* Related posts count */}
                <Group mb="lg">
                    <Skeleton height={24} width={200} radius="sm" />
                </Group>

                {/* Action buttons */}
                <Group justify="flex-end" mt="xl">
                    <Skeleton height={36} width={110} radius="sm" />
                    <Skeleton height={36} width={110} radius="sm" />
                </Group>
            </Card>
        </Container>
    );
}