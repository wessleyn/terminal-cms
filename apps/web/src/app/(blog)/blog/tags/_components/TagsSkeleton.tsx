'use client';

import { Box, Container, Grid, Group, SimpleGrid, Skeleton, useComputedColorScheme, useMantineTheme } from '@mantine/core';

export default function TagsSkeleton() {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme('dark');
    const isDark = colorScheme === 'dark';

    return (
        <>
            {/* Tags Header Skeleton */}
            <Box py="xl" style={{
                backgroundColor: isDark ? theme.colors.dark[8] : theme.colors.gray[0]
            }}>
                <Container size="xl">
                    <Group mb="lg">
                        <Skeleton height={32} width={32} radius="sm" />
                        <Skeleton height={32} width={200} radius="sm" />
                    </Group>
                    <Skeleton height={24} width="60%" mb="xl" radius="sm" />
                    <Skeleton height={42} width={400} mb="xl" radius="md" />
                </Container>
            </Box>

            <Container size="xl" py="xl">
                {/* Tags Grid Skeleton */}
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                    {Array(12).fill(0).map((_, index) => (
                        <Box
                            key={index}
                            p="md"
                            style={{
                                border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                                borderRadius: theme.radius.md,
                                backgroundColor: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
                            }}
                        >
                            <Group justify="space-between" mb="xs">
                                <Skeleton height={22} width={80} radius="sm" />
                                <Skeleton height={22} width={60} radius="sm" variant="outline" />
                            </Group>
                            <Skeleton height={16} width="100%" radius="sm" />
                        </Box>
                    ))}
                </SimpleGrid>
            </Container>

            {/* Newsletter Skeleton */}
            <Box py="xl" style={{
                backgroundColor: isDark ? theme.colors.dark[8] : theme.colors.gray[0]
            }}>
                <Container size="xl">
                    <Skeleton height={32} width={300} mb="md" radius="sm" />
                    <Skeleton height={20} width="70%" mb="xl" radius="sm" />
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 8 }}>
                            <Skeleton height={42} width="100%" radius="md" />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <Skeleton height={42} width="100%" radius="md" />
                        </Grid.Col>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}