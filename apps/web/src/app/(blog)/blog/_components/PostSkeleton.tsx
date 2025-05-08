'use client';

import { Box, Card, Container, Grid, Paper, SimpleGrid, Skeleton, Stack } from '@mantine/core';

export function PostCardSkeleton() {
  return (
    <Card withBorder shadow="sm" padding={0} radius="md">
      <Card.Section>
        <Skeleton height={200} width="100%" />
      </Card.Section>

      <Box p="md">
        <Skeleton height={24} width={80} mb="xs" />
        <Skeleton height={28} mb="sm" />
        <Skeleton height={20} width="70%" mb="md" />
        <Skeleton height={20} width="100%" mb="xs" />
        <Skeleton height={20} width="90%" mb="md" />
        <Skeleton height={36} width="100%" />
      </Box>
    </Card>
  );
}

export function FeaturedPostSkeleton() {
  return (
    <Box
      style={{
        position: 'relative',
        height: '60vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Skeleton height="100%" width="100%" />
      <Box
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
        }}
      >
        <Skeleton height={30} width={100} mb="md" />
        <Skeleton height={40} width="80%" mb="md" />
        <Skeleton height={20} width="50%" mb="md" />
        <Skeleton height={36} width={120} />
      </Box>
    </Box>
  );
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <Grid.Col key={`skeleton-${index}`} span={{ base: 12, sm: 6, lg: 4 }}>
            <PostCardSkeleton />
          </Grid.Col>
        ))}
    </Grid>
  );
}

export function BlogPageSkeleton() {
  // Match the same constants used in the FeaturedPostsSection component
  const PRIMARY_COL_HEIGHT = '300px';
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;
  const MAIN_POST_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} + ${SECONDARY_COL_HEIGHT} + var(--mantine-spacing-md))`;

  return (
    <div style={{ width: '100%' }}>
      {/* Featured Posts Section Skeleton */}
      <Paper
        shadow="md"
        p="md"
        radius="md"
        bg="var(--mantine-color-gray-9)"
        style={{
          width: '100%',
          minHeight: 'calc(100vh - 60px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          paddingTop: '2rem',
          paddingBottom: '2rem',
        }}
      >
        <Container size="xl" style={{ width: '100%' }}>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            {/* First column - Two stacked posts */}
            <div>
              <Box style={{ height: PRIMARY_COL_HEIGHT, marginBottom: 'var(--mantine-spacing-md)' }}>
                <Skeleton height="100%" width="100%" radius="md" />
              </Box>
              <Box style={{ height: SECONDARY_COL_HEIGHT }}>
                <Skeleton height="100%" width="100%" radius="md" />
              </Box>
            </div>

            {/* Center column - One large post */}
            <Box style={{ height: MAIN_POST_HEIGHT }}>
              <Skeleton height="100%" width="100%" radius="md" />
            </Box>

            {/* Third column - Two stacked posts */}
            <div>
              <Box style={{ height: PRIMARY_COL_HEIGHT, marginBottom: 'var(--mantine-spacing-md)' }}>
                <Skeleton height="100%" width="100%" radius="md" />
              </Box>
              <Box style={{ height: SECONDARY_COL_HEIGHT }}>
                <Skeleton height="100%" width="100%" radius="md" />
              </Box>
            </div>
          </SimpleGrid>
        </Container>
      </Paper>

      {/* Recent Posts Section Skeleton */}
      <Container size="xl" py="xl">
        <Skeleton height={40} width={250} mb="xl" />
        <PostGridSkeleton count={3} />
      </Container>

      {/* Trending Posts Section Skeleton */}
      <Container size="xl" py="xl">
        <Skeleton height={40} width={200} mb="xl" />
        <PostGridSkeleton count={3} />
      </Container>

      {/* Newsletter Section Skeleton */}
      <Container size="xl" py="xl">
        <Skeleton height={40} width={300} mb="xl" />
        <Stack>
          <Skeleton height={120} radius="md" />
          <Skeleton height={60} radius="md" />
        </Stack>
      </Container>
    </div>
  );
}