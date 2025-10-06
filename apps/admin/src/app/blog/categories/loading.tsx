'use client'

import { Container, Group, Paper, Skeleton, Table } from '@mantine/core';

export default function CategoriesLoading() {
    return (
        <Container fluid px="md">
            {/* Page header with button */}
            <Group justify="space-between" mb="lg">
                <Skeleton height={32} width={220} radius="md" />
                <Skeleton height={36} width={180} radius="md" />
            </Group>

            {/* Categories table */}
            <Paper p={0} withBorder radius="md">
                <Table striped>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                <Skeleton height={18} width={100} />
                            </Table.Th>
                            <Table.Th>
                                <Skeleton height={18} width={80} />
                            </Table.Th>
                            <Table.Th>
                                <Skeleton height={18} width={140} />
                            </Table.Th>
                            <Table.Th style={{ width: 110 }}>
                                <Skeleton height={18} width={60} />
                            </Table.Th>
                            <Table.Th style={{ width: 140 }}>
                                <Skeleton height={18} width={80} />
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {Array(6).fill(0).map((_, index) => (
                            <Table.Tr key={index}>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Skeleton circle height={20} width={20} />
                                        <Skeleton height={18} width={(index % 2 === 0 ? 140 : 100)} />
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Skeleton height={18} width={(index % 2 === 0 ? 80 : 120)} />
                                </Table.Td>
                                <Table.Td>
                                    <Skeleton height={18} width={(index % 3 === 0 ? 180 : 220)} />
                                </Table.Td>
                                <Table.Td>
                                    <Skeleton height={24} width={60} radius="xl" />
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Skeleton circle height={28} width={28} />
                                        <Skeleton circle height={28} width={28} />
                                        <Skeleton circle height={28} width={28} />
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>
        </Container>
    );
}