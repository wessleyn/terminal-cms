'use client';

import { Avatar, Menu, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconLogout, IconSettings, IconSwitchHorizontal } from '@tabler/icons-react';
import { useState } from 'react';

interface ProfileMenuProps {
    profileImag: string;
    name?: string;
    role?: string;
}

export default function ProfileMenu({ profileImag, name = 'User', role = 'User' }: ProfileMenuProps) {
    const [opened, setOpened] = useState(false);

    return (
        <Menu
            width={200}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setOpened(false)}
            onOpen={() => setOpened(true)}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton className="profile-button">
                    <div className="profile-info">
                        <Avatar src={profileImag} alt={name} radius="xl" size={36} />
                        <div className="profile-details">
                            <Text size="sm" fw={500}>{name}</Text>
                            <Text c="dimmed" size="xs">{role}</Text>
                        </div>
                    </div>
                    <IconChevronDown size={16} className={opened ? 'chevron-rotated' : ''} />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item leftSection={<IconSettings size={14} />}>
                    Account settings
                </Menu.Item>
                <Menu.Item leftSection={<IconSwitchHorizontal size={14} />}>
                    Change account
                </Menu.Item>
                <Menu.Item leftSection={<IconLogout size={14} />}>
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}