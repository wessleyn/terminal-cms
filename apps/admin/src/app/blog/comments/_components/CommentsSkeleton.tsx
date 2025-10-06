'use client';

import { Card, Group, Skeleton, Stack, Table } from '@mantine/core';

export function CommentsSkeleton() {
  return (
    <Stack gap="md">
      {/* Header stats skeleton */}
      {/* <Paper p="md" withBorder mb="lg">
        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Group key={i} p="md">
              <Skeleton height={40} circle />
              <Stack gap="sm">
                <Skeleton height={14} width={80} />
                <Skeleton height={26} width={40} />
              </Stack>
            </Group>
          ))}
        </SimpleGrid>
      </Paper> */}

      {/* Comments table skeleton */}
      <Card p={0} radius="md" withBorder>
        <Table striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}>
                <Skeleton height={18} circle />
              </Table.Th>
              <Table.Th>
                <Skeleton height={18} width={100} />
              </Table.Th>
              <Table.Th style={{ width: 150 }}>
                <Skeleton height={18} width={80} />
              </Table.Th>
              <Table.Th style={{ width: 120 }}>
                <Skeleton height={18} width={60} />
              </Table.Th>
              <Table.Th style={{ width: 120 }}>
                <Skeleton height={18} width={70} />
              </Table.Th>
              <Table.Th style={{ width: 80 }}>
                <Skeleton height={18} width={50} />
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <Table.Tr key={i}>
                <Table.Td>
                  <Skeleton height={18} circle />
                </Table.Td>
                <Table.Td>
                  <Stack gap="xs">
                    <Skeleton height={40} />
                    <Group gap="xs">
                      <Skeleton height={16} width={60} />
                      <Skeleton height={16} width={120} />
                    </Group>
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Group align="center" gap="sm">
                    <Skeleton height={30} circle width={30} />
                    <Stack gap={4}>
                      <Skeleton height={16} width={80} />
                      <Skeleton height={12} width={120} />
                    </Stack>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Stack gap={4}>
                    <Skeleton height={16} width={70} />
                    <Skeleton height={12} width={40} />
                  </Stack>
                </Table.Td>
                <Table.Td>
                  <Skeleton height={22} width={80} radius="xl" />
                </Table.Td>
                <Table.Td>
                  <Skeleton height={22} circle width={22} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
