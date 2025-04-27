'use client';

import { Badge, Menu } from '@mantine/core';
import { HappyIndex } from '@repo/db';
import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './HappyStatusBadge.module.css';
import { getHappyIndexVariant } from './getHappyIndexVariant';

interface HappyStatusBadgeProps {
    status: HappyIndex;
    onStatusChange: (newStatus: HappyIndex) => void;
}

export default function HappyStatusBadge({ status, onStatusChange }: HappyStatusBadgeProps) {
    const [opened, setOpened] = useState(false);


    const getDisplayText = (status: HappyIndex) => {
        return status.toLowerCase().replace('_', ' ');
    };

    const handleStatusChange = (newStatus: HappyIndex) => {
        onStatusChange(newStatus);
        setOpened(false);
    };

    return (
        <Menu opened={opened} onChange={setOpened} position="bottom-start" withinPortal>
            <Menu.Target>
                <Badge
                    variant="light"
                    color={getHappyIndexVariant(status)}
                    className={classes.badge}
                    rightSection={<IconChevronDown size={12} />}
                >
                    {getDisplayText(status)}
                </Badge>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => handleStatusChange(HappyIndex.AWESOME)}
                    className={status === HappyIndex.AWESOME ? classes.activeItem : ''}
                >
                    Awesome
                </Menu.Item>
                <Menu.Item
                    onClick={() => handleStatusChange(HappyIndex.USEFUL)}
                    className={status === HappyIndex.USEFUL ? classes.activeItem : ''}
                >
                    Useful
                </Menu.Item>
                <Menu.Item
                    onClick={() => handleStatusChange(HappyIndex.NEUTRAL)}
                    className={status === HappyIndex.NEUTRAL ? classes.activeItem : ''}
                >
                    Neutral
                </Menu.Item>
                <Menu.Item
                    onClick={() => handleStatusChange(HappyIndex.COOL)}
                    className={status === HappyIndex.COOL ? classes.activeItem : ''}
                >
                    COOL
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}