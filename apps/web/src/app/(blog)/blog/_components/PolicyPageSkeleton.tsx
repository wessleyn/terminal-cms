'use client';

import { Box, Container, Group, Paper, Skeleton, Stack } from '@mantine/core';

export default function PolicyPageSkeleton() {
  return (
    <Container size="md" py="xl">
      <Paper p="xl" withBorder>
        <Stack gap="xl">
          <div>
            <Skeleton height={36} width={250} mb="md" />
            <Group mt="md">
              <Skeleton height={14} width={180} />
            </Group>
          </div>

          <Skeleton height={60} width="100%" />

          {/* Multiple sections */}
          {Array(5).fill(0).map((_, index) => (
            <Box key={index}>
              <Skeleton height={24} width="60%" mb="sm" />
              <Skeleton height={16} width="100%" mb="xs" />
              <Skeleton height={16} width="95%" mb="xs" />
              <Skeleton height={16} width="90%" mb="xs" />
              <Skeleton height={16} width="97%" mb="xs" />
              <Skeleton height={16} width="85%" />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}