'use client'
import { TableHeaderFilter } from '@/app/_components/TableHeaderFilter';
import { Button, Container, Paper, Table } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSearchStore } from '../../../../../_stores/searchStore';
import createUser from '../../_actions/createUser';
import { BlogUser } from '../../_actions/fetchUsers';
import { EmptyState } from '../EmptyState';
import { UserRow } from './UserRow';
import styles from './UsersTable.module.css';

interface UsersTableProps {
    users: BlogUser[];
}

export function UsersTable({ users }: UsersTableProps) {
    const router = useRouter();
    const [filteredUsers, setFilteredUsers] = useState<BlogUser[]>(users || []);
    const searchQuery = useSearchStore(state => state.query);

    // Column filters
    const [roleFilters, setRoleFilters] = useState<string[]>([]);
    const [lastActiveFilters, setLastActiveFilters] = useState<string[]>([]);

    // Get unique roles for filter options
    const roleOptions = Array.from(new Set(users.map(user => user.role)))
        .map(role => ({ value: role, label: role }));

    // Basic last active filter options
    const lastActiveOptions = [
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'week', label: 'This week' },
        { value: 'month', label: 'This month' },
    ];

    // Search and filter functionality
    const applyFilters = useCallback(() => {
        let result = [...users];

        // Apply text search
        if (searchQuery.trim()) {
            result = result.filter(user =>
                (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply role filter
        if (roleFilters.length > 0) {
            result = result.filter(user =>
                roleFilters.includes(user.role)
            );
        }

        // Apply last active filter
        if (lastActiveFilters.length > 0) {
            result = result.filter(user => {
                const lastActiveText = user.lastActive.toLowerCase();
                return lastActiveFilters.some(filter => {
                    switch (filter) {
                        case 'today':
                            return lastActiveText.includes('hour') || lastActiveText.includes('minute') || lastActiveText.includes('second');
                        case 'yesterday':
                            return lastActiveText.includes('day') && (lastActiveText.includes('1 day') || lastActiveText.includes('a day'));
                        case 'week':
                            return lastActiveText.includes('day') || lastActiveText.includes('week') && (lastActiveText.includes('1 week') || lastActiveText.includes('a week'));
                        case 'month':
                            return lastActiveText.includes('month') || lastActiveText.includes('week') || lastActiveText.includes('day');
                        default:
                            return false;
                    }
                });
            });
        }

        setFilteredUsers(result);
    }, [users, searchQuery, roleFilters, lastActiveFilters]);

    // Apply filters when any filter changes
    useEffect(() => {
        applyFilters();
    }, [searchQuery, roleFilters, lastActiveFilters, applyFilters]);

    // Update filtered users when users prop changes
    useEffect(() => {
        setFilteredUsers(users || []);
    }, [users]);

    const handleCreateUser = async () => {
        const result = await createUser({
            name: 'New User',
            email: `user_${Date.now()}@example.com`,
        });

        if (result.success && result.userId) {
            router.push(`/blog/users/${result.userId}?edit=true`);
            router.refresh();
        } else {
            notifications.show({
                title: 'Error',
                message: result.message || 'Failed to create user',
                color: 'red',
            });
        }
    };
    // Handle user deletion
    const handleUserDelete = useCallback((userId: string) => {
        setFilteredUsers(prev => prev.filter(user => user.id !== userId));
    }, []);

    return (
        <Container fluid px="md" pt="md">
            {/* Users Table */}
            <Paper shadow="xs" radius="md" withBorder className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <Table verticalSpacing="sm" highlightOnHover striped withTableBorder className={styles.fullWidthTable}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className={styles.userColumn}>User</Table.Th>
                                <Table.Th className={styles.roleColumn}>
                                    <TableHeaderFilter
                                        title="Role"
                                        options={roleOptions}
                                        activeFilters={roleFilters}
                                        onChange={setRoleFilters}
                                    />
                                </Table.Th>
                                <Table.Th className={styles.emailColumn}>Email</Table.Th>
                                <Table.Th className={styles.lastActiveColumn}>
                                    <TableHeaderFilter
                                        title="Last Active"
                                        options={lastActiveOptions}
                                        activeFilters={lastActiveFilters}
                                        onChange={setLastActiveFilters}
                                    />
                                </Table.Th>
                                <Table.Th className={styles.actionsColumn}>
                                    <Button
                                     onClick={handleCreateUser}
                                        leftSection={<IconPlus size={16} />}
                                    >
                                        New User
                                    </Button>                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody className={styles.tableBody}>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        className={index === filteredUsers.length - 1 ? styles.lastRow : undefined}
                                        onDelete={() => handleUserDelete(user.id)}
                                    />
                                ))
                            ) : (
                                <EmptyState />
                            )}
                        </Table.Tbody>
                    </Table>
                </div>
            </Paper>
        </Container>
    );
}