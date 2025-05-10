'use client'

import { Container, Flex, Paper, Skeleton, Table } from '@mantine/core';
import styles from './UsersTable.module.css';

export function UserTableSkeleton() {
    return (
        <Container fluid px="md" pt="md">
            {/* Search bar skeleton */}
            <Paper shadow="xs" radius="md" p="md" mb="md" className={styles.searchBarContainer}>
                <Skeleton height={36} radius="sm" />
            </Paper>

            {/* Table skeleton */}
            <Paper shadow="xs" radius="md" withBorder className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <Table verticalSpacing="sm" striped withTableBorder className={styles.fullWidthTable}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className={styles.userColumn}>
                                    User
                                </Table.Th>
                                <Table.Th className={styles.roleColumn}>
                                    <Flex align="center" gap="xs">
                                        <Skeleton height={18} width={40} radius="sm" />
                                        <Skeleton height={18} width={20} circle />
                                    </Flex>
                                </Table.Th>
                                <Table.Th className={styles.emailColumn}>Email</Table.Th>
                                <Table.Th className={styles.lastActiveColumn}>
                                    <Flex align="center" gap="xs">
                                        <Skeleton height={18} width={70} radius="sm" />
                                        <Skeleton height={18} width={20} circle />
                                    </Flex>
                                </Table.Th>
                                <Table.Th className={styles.actionsColumn} />
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody className={styles.tableBody}>
                            {Array(5).fill(0).map((_, index) => (
                                <Table.Tr
                                    key={index}
                                    className={index === 4 ? styles.lastRow : undefined}
                                >
                                    <Table.Td className={styles.userColumn}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Skeleton height={30} circle />
                                            <Skeleton height={16} width={120} radius="sm" />
                                        </div>
                                    </Table.Td>
                                    <Table.Td className={styles.roleColumn}><Skeleton height={22} width={80} radius="xl" /></Table.Td>
                                    <Table.Td className={styles.emailColumn}><Skeleton height={16} width={150} radius="sm" /></Table.Td>
                                    <Table.Td className={styles.lastActiveColumn}><Skeleton height={16} width={100} radius="sm" /></Table.Td>
                                    <Table.Td className={styles.actionsColumn}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                            <Skeleton height={22} width={22} circle />
                                            <Skeleton height={22} width={22} circle />
                                            <Skeleton height={22} width={22} circle />
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>
            </Paper>
        </Container>
    );
}
