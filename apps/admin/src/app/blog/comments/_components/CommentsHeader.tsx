'use client';

import { Box, Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { IconMessage, IconThumbDown, IconThumbUp, IconUserQuestion } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CommentStatsProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function CommentsHeader({ total, pending, approved, rejected }: CommentStatsProps) {
  const pathname = usePathname();

  const isActiveTab = (path: string) => pathname === path;

  const stats = [
    {
      title: 'All Comments',
      value: total,
      icon: IconMessage,
      color: 'blue',
      path: '/blog/comments',
    },
    {
      title: 'Pending',
      value: pending,
      icon: IconUserQuestion,
      color: 'yellow',
      path: '/blog/comments/pending',
    },
    {
      title: 'Approved',
      value: approved,
      icon: IconThumbUp,
      color: 'green',
      path: '/blog/comments/approved',
    },
    {
      title: 'Rejected',
      value: rejected,
      icon: IconThumbDown,
      color: 'red',
      path: '/blog/comments/rejected',
    },
  ];

  return (
    <Paper p="md" withBorder mb="lg">
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
        {stats.map((stat) => {
          const active = isActiveTab(stat.path);
          return (
            <Box
              key={stat.title}
              component={Link}
              href={stat.path}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Group
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: active ? `var(--mantine-color-${stat.color}-light)` : undefined,
                  border: active ? `1px solid var(--mantine-color-${stat.color}-light)` : undefined,
                }}
              >
                <ThemeIcon
                  color={stat.color}
                  variant={active ? 'filled' : 'light'}
                  size="lg"
                  radius="md"
                >
                  <stat.icon style={{ width: '70%', height: '70%' }} />
                </ThemeIcon>

                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                </div>
              </Group>
            </Box>
          );
        })}
      </SimpleGrid>
    </Paper>
  );
}
