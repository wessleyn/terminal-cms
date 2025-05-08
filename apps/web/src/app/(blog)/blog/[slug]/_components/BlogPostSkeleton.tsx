'use client';

import { Avatar, Box, Container, Grid, Group, Skeleton, Stack } from '@mantine/core';

export default function BlogPostSkeleton() {
  return (
    <>
      {/* Header Skeleton */}
      <div
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '100px 0',
          color: 'white',
          marginBottom: '2rem'
        }}
      >
        <Container size="xl" ta="center">
          <Skeleton height={24} width={80} style={{ margin: '0 auto 1rem' }} />
          <Skeleton height={50} width="70%" style={{ margin: '0 auto 2rem' }} />

          <Group justify="center" align="center">
            <Avatar radius="xl" size="md">
              <Skeleton height="100%" circle />
            </Avatar>
            <Skeleton height={20} width={120} />
            <Skeleton height={20} width={90} ml="md" />
          </Group>
        </Container>
      </div>

      {/* Content Skeleton */}
      <Container size="xl">
        <Grid>
          {/* Main Content */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack>
              <Skeleton height={20} width="95%" />
              <Skeleton height={20} width="90%" />
              <Skeleton height={20} width="100%" />
              <Skeleton height={20} width="85%" />
              <Skeleton height={300} width="100%" my="md" />
              <Skeleton height={20} width="95%" />
              <Skeleton height={20} width="90%" />
              <Skeleton height={20} width="100%" />
              <Skeleton height={20} width="85%" />
              <Skeleton height={20} width="95%" />
              <Skeleton height={20} width="90%" />
              <Skeleton height={20} width="100%" />
              <Skeleton height={20} width="85%" />
            </Stack>
          </Grid.Col>

          {/* Sidebar */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box p="md" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
              <Stack align="center">
                <Avatar size={100} radius="xl">
                  <Skeleton height="100%" circle />
                </Avatar>
                <Skeleton height={24} width={150} />
                <Skeleton height={60} width="90%" />
                <Skeleton height={36} width={120} />

                <Group mt="md" justify="center">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} height={20} width={20} circle />
                  ))}
                </Group>
              </Stack>
            </Box>
          </Grid.Col>
        </Grid>

        {/* Related Posts Skeleton */}
        <Box mt="xl">
          <Skeleton height={30} width={200} mb="xl" />
          <Grid>
            {[1, 2, 3, 4].map(i => (
              <Grid.Col key={i} span={{ base: 12, sm: 6, md: 3 }}>
                <Card>
                  <Skeleton height={140} mb="md" />
                  <Skeleton height={20} width="90%" mb="sm" />
                  <Skeleton height={20} width="70%" />
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Box>

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

// Card component for related posts skeleton
function Card({ children }: { children: React.ReactNode }) {
  return (
    <Box style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
      {children}
    </Box>
  );
}