'use client';

import { Button, Center, Flex, Paper, Skeleton, Table, TextInput } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import classes from './ProjectsTable.module.css';

export function ProjectTableSkeleton() {
    // Number of skeleton rows to display
    const skeletonRows = 3;

    return (
        <div className={classes.projectsContainer}>
            {/* Search bar and New Project button */}
            <div className={classes.searchContainer}>
                <Flex gap="md" className={classes.topControls}>
                    <TextInput
                        placeholder="Search projects..."
                        value=""
                        disabled
                        leftSection={<IconSearch size={16} />}
                        className={classes.search}
                    />
                    <Button
                        leftSection={<IconPlus size={16} />}
                        variant="filled"
                        disabled
                        className={classes.createButton}
                    >
                        New Project
                    </Button>
                </Flex>
            </div>

            {/* Projects Table Skeleton */}
            <Paper shadow="xs" radius="md" withBorder className={classes.tableContainer}>
                <Table
                    className={classes.table}
                    striped
                    withTableBorder
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Project</Table.Th>
                            <Table.Th>
                                <Flex align="center" gap="xs">
                                    <Skeleton height={18} width={85} radius="sm" />
                                    <Skeleton height={18} width={20} circle />
                                </Flex>
                            </Table.Th>
                            <Table.Th>
                                <Flex align="center" gap="xs">
                                    <Skeleton height={18} width={85} radius="sm" />
                                    <Skeleton height={18} width={20} circle />
                                </Flex>
                            </Table.Th>
                            <Table.Th>
                                <Flex align="center" gap="xs">
                                    <Skeleton height={18} width={75} radius="sm" />
                                    <Skeleton height={18} width={20} circle />
                                </Flex>
                            </Table.Th>
                            <Table.Th>Engagement</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {Array(skeletonRows).fill(0).map((_, index) => (
                            <Table.Tr
                                key={index}
                                className={classes[`row${index % 10}`]}
                            >
                                <Table.Td>
                                    <Skeleton height={20} width="80%" radius="sm" />
                                </Table.Td>
                                <Table.Td>
                                    <Skeleton height={24} width={100} radius="xl" />
                                </Table.Td>
                                <Table.Td>
                                    <Skeleton height={24} width={100} radius="xl" />
                                </Table.Td>
                                <Table.Td>
                                    <Skeleton height={24} width={100} radius="xl" />
                                </Table.Td>
                                <Table.Td>
                                    <Skeleton height={16} radius="sm" mb={4} />
                                    <Skeleton height={22} radius="sm" />
                                </Table.Td>
                                <Table.Td>
                                    <Center>
                                        <Flex gap="sm">
                                            <Skeleton height={30} width={30} circle />
                                            <Skeleton height={30} width={30} circle />
                                        </Flex>
                                    </Center>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Paper>

            {/* Pagination Skeleton */}
            <div className={classes.paginationContainer}>
                <Skeleton height={36} width={200} radius="sm" />
            </div>
        </div>
    );
}
