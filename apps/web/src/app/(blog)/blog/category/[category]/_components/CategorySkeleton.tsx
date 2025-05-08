'use client';

import { Box, Container, Grid, Group, Skeleton } from '@mantine/core';

export default function CategorySkeleton() {
  return (
    <>
      {/* Category Header Skeleton */}
      <Box py="xl" style={{
        backgroundColor: '#f8f9fa' // Light gray background as fallback
      }}>
        <Container size="xl">
          <Skeleton height={35} width={180} mb="md" />
          <Skeleton height={20} width="70%" mb="xl" />
        </Container>
      </Box>

      <Container size="xl" py="xl">
        {/* Posts Grid Skeleton */}
        <Grid>
          {Array(9).fill(0).map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
              <Box style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                <Skeleton height={200} width="100%" />
                <Box p="md">
                  <Group mb="xs">
                    <Skeleton height={20} width={60} />
                    <Skeleton height={20} width={80} />
                  </Group>
                  <Skeleton height={28} mb="sm" />
                  <Group mb="md">
                    <Skeleton height={20} width={20} circle />
                    <Skeleton height={16} width={80} />
                    <Skeleton height={16} width={100} />
                  </Group>
                  <Skeleton height={16} width="100%" mb="xs" />
                  <Skeleton height={16} width="90%" mb="md" />
                  <Skeleton height={36} width="100%" />
                </Box>
              </Box>
            </Grid.Col>
          ))}
        </Grid>

        {/* Pagination Skeleton */}
        <Group justify="center" mt="xl" py="xl">
          <Skeleton height={36} width={300} />
        </Group>

        {/* Newsletter Skeleton */}
        <Box mt="xl" p="xl" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
          <Skeleton height={30} width={250} mb="md" />
          <Skeleton height={20} width="70%" mb="xl" />
          <Grid>
            <Grid.Col span={{ base: 12, sm: 8 }}>
              <Skeleton height={42} width="100%" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Skeleton height={42} width="100%" />
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </>
  );
}