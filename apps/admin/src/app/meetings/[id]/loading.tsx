'use client';

import { Card, Container, Grid, Group, Skeleton, Stack } from "@mantine/core";

export default function MeetingDetailLoading() {
    return (
        <Container size="lg" p="md">
            {/* Back button */}
            <Group mb="lg">
                <Skeleton height={36} width={120} radius="md" />
            </Group>

            <Card shadow="sm" padding="lg" radius="md">
                {/* Meeting Header */}
                <Group justify="space-between" mb="lg">
                    <Stack gap="xs">
                        <Skeleton height={28} width={250} radius="sm" mb="xs" />
                        <Group>
                            <Skeleton height={20} width={150} radius="sm" />
                            <Skeleton height={24} width={100} radius="xl" />
                        </Group>
                    </Stack>

                    {/* Status dropdown */}
                    <Skeleton height={36} width={120} radius="sm" />
                </Group>

                {/* Meeting Details */}
                <Grid gutter="md">
                    {/* Left column with meeting details */}
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="md">
                            {[1, 2, 3, 4].map((_, index) => (
                                <Group key={index} align="flex-start">
                                    <Skeleton circle height={20} width={20} />
                                    <Skeleton height={20} width={`${Math.random() * 30 + 60}%`} />
                                </Group>
                            ))}
                        </Stack>
                    </Grid.Col>

                    {/* Right column with project details */}
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Card withBorder padding="md" radius="md">
                            <Skeleton height={24} width="70%" mb="md" />
                            <Skeleton height={80} radius="sm" mb="lg" />

                            {/* Budget info */}
                            <Group mb="md">
                                <Skeleton circle height={20} width={20} />
                                <Skeleton height={20} width="40%" />
                            </Group>

                            {/* Meeting notes section */}
                            <Skeleton height={24} width="40%" mb="md" />
                            <Skeleton height={100} radius="sm" mb="md" />

                            {/* Save button */}
                            <Group justify="flex-end">
                                <Skeleton height={36} width={120} radius="sm" />
                            </Group>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Card>
        </Container>
    );
}