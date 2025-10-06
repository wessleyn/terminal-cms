import { Box, Card, Container, Grid, Group, Skeleton, Stack } from '@mantine/core';

export default function ProjectDetailLoading() {
    return (
        <Container>
            <Box py="md">
                {/* Navigation and status badges */}
                <Group justify="space-between" mb="lg">
                    <Skeleton height={36} width={220} radius="sm" />
                    <Group>
                        <Skeleton height={28} width={100} radius="xl" />
                        <Skeleton height={28} width={100} radius="xl" />
                        <Skeleton height={28} width={100} radius="xl" />
                    </Group>
                </Group>

                {/* Save status indicator */}
                <Skeleton height={24} width={150} radius="sm" mb="lg" />

                {/* Project title */}
                <Skeleton height={42} width="70%" radius="md" mb="xl" />

                {/* Project image and gallery */}
                <Card withBorder mb="lg" p="md">
                    <Stack gap="md">
                        <Skeleton height={300} radius="md" mb="sm" />
                        <Group>
                            <Skeleton height={80} width={80} radius="sm" />
                            <Skeleton height={80} width={80} radius="sm" />
                            <Skeleton height={80} width={80} radius="sm" />
                        </Group>
                    </Stack>
                </Card>

                {/* Project details */}
                <Grid>
                    {/* Left column - Description and tags */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack gap="md">
                            <Box>
                                <Skeleton height={24} width={150} mb="sm" />
                                <Skeleton height={120} radius="sm" />
                            </Box>

                            <Box>
                                <Skeleton height={24} width={100} mb="sm" />
                                <Group>
                                    <Skeleton height={32} width={80} radius="xl" />
                                    <Skeleton height={32} width={120} radius="xl" />
                                    <Skeleton height={32} width={100} radius="xl" />
                                </Group>
                            </Box>
                        </Stack>
                    </Grid.Col>

                    {/* Right column - Project links and engagement */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Stack gap="md">
                            {/* URLs */}
                            <Box>
                                <Skeleton height={24} width={150} mb="sm" />
                                <Skeleton height={36} radius="sm" mb="sm" />
                            </Box>

                            <Box>
                                <Skeleton height={24} width={150} mb="sm" />
                                <Skeleton height={36} radius="sm" mb="sm" />
                            </Box>

                            {/* Engagement */}
                            <Card withBorder p="md" radius="md">
                                <Skeleton height={24} width={150} mb="md" />
                                <Group>
                                    <Stack gap="xs" style={{ flex: 1 }}>
                                        <Skeleton height={24} width={80} />
                                        <Skeleton height={32} width={60} />
                                    </Stack>
                                    <Stack gap="xs" style={{ flex: 1 }}>
                                        <Skeleton height={24} width={80} />
                                        <Skeleton height={32} width={60} />
                                    </Stack>
                                    <Stack gap="xs" style={{ flex: 1 }}>
                                        <Skeleton height={24} width={80} />
                                        <Skeleton height={32} width={60} />
                                    </Stack>
                                </Group>
                            </Card>
                        </Stack>
                    </Grid.Col>
                </Grid>

                {/* Action buttons */}
                <Group justify="flex-end" mt="xl">
                    <Skeleton height={38} width={120} radius="sm" />
                    <Skeleton height={38} width={120} radius="sm" />
                </Group>
            </Box>
        </Container>
    );
}