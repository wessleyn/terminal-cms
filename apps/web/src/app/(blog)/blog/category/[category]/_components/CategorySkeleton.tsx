'use client';

import { Box, Container, Grid, Group, Skeleton, useComputedColorScheme, useMantineTheme } from '@mantine/core';

export default function CategorySkeleton() {
  const theme = useMantineTheme();
  // Use the proper hook to get the current color scheme
  const colorScheme = useComputedColorScheme('dark');
  const isDark = colorScheme === 'dark';

  return (
    <>
      {/* Category Header Skeleton - Match CategoryHeader component */}
      <Box py="xl" style={{
      }}>
        <Container size="xl">
          <Skeleton height={18} width={80} mb="xs" radius="sm" />
          <Skeleton height={38} width={200} mb="md" radius="sm" />
          <Skeleton height={24} width="60%" mb="xl" radius="sm" />
        </Container>
      </Box>

      <Container size="xl" py="xl">
        {/* Posts Grid Skeleton - Match PostGrid component */}
        <Grid>
          {Array(9).fill(0).map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
              <Box style={{
                border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                borderRadius: theme.radius.md,
                overflow: 'hidden'
              }}>
                <Skeleton height={200} width="100%" radius={0} />
                <Box p="1rem">
                  <Group mb="xs">
                    <Skeleton height={22} width={80} radius="sm" />
                    <Skeleton height={22} width={80} radius="sm" variant="outline" />
                  </Group>
                  <Skeleton height={28} mb="sm" width="90%" radius="sm" />
                  <Group mb="md">
                    <Skeleton height={24} width={24} circle />
                    <Skeleton height={16} width={80} radius="sm" />
                    <Skeleton height={16} width={100} radius="sm" c="dimmed" />
                  </Group>
                  <Skeleton height={16} width="100%" mb="xs" radius="sm" />
                  <Skeleton height={16} width="90%" mb="xs" radius="sm" />
                  <Skeleton height={16} width="80%" mb="md" radius="sm" />
                  <Skeleton height={36} width="100%" radius="md" />
                </Box>
              </Box>
            </Grid.Col>
          ))}
        </Grid>

        {/* Pagination Skeleton - Match design of Mantine Pagination component */}
        <Group justify="center" mt="xl" py="xl">
          <Group gap="xs">
            {Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} height={36} width={36} radius="sm" />
            ))}
          </Group>
        </Group>
      </Container>

      {/* Newsletter Skeleton - Match UniversalNewsletter component */}
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
