'use client';

import { Anchor, Avatar, Badge, Group, Table, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { BlogUser } from '../_actions/fetchUsers';
import { UserActions } from './UserActions';
import styles from './UsersTable.module.css';

const roleColors: Record<string, string> = {
    admin: 'red',
    editor: 'blue',
    author: 'green',
    contributor: 'orange',
    user: 'gray',
};

interface UserRowProps {
    user: BlogUser;
    className?: string;
    onDelete?: () => void;
}

export function UserRow({ user, className, onDelete }: UserRowProps) {
    const router = useRouter();

    const handleRowClick = () => {
        router.push(`/blog/users/${user.id}`);
    };

    return (
        <Table.Tr
            onClick={handleRowClick}
            style={{ cursor: 'pointer' }}
            className={`${styles.userRowHover} ${className || ''}`}
        >
            <Table.Td className={styles.userColumn}>
                <Group gap="sm">
                    <Avatar size={30} src={user.avatar} radius={30} />
                    <Text fz="sm" fw={500} className={styles.textEllipsis}>
                        {user.name || 'Unnamed User'}
                    </Text>
                </Group>
            </Table.Td>

            <Table.Td className={styles.roleColumn}>
                <Badge color={roleColors[user.role.toLowerCase()] || 'gray'} variant="light">
                    {user.role}
                </Badge>
            </Table.Td>
            <Table.Td className={styles.emailColumn}>
                <Anchor
                    component="button"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click when clicking on email
                        window.location.href = `mailto:${user.email}`;
                    }}
                    className={styles.textEllipsis}
                >
                    {user.email}
                </Anchor>
            </Table.Td>
            <Table.Td className={styles.lastActiveColumn}>
                <Text fz="sm" className={styles.textEllipsis}>{user.lastActive}</Text>
            </Table.Td>
            <Table.Td className={styles.actionsColumn}>
                <UserActions userId={user.id} userName={user.name} email={user.email} onDelete={onDelete} />
            </Table.Td>
        </Table.Tr>
    );
}
