'use client';

import { Badge, Menu } from '@mantine/core';
import { ActivityStatus } from '@repo/db';
import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './ActivityStatusBadge.module.css';
import { getActivityStatusVariant } from './getActivityStatusVariant';

interface ActivityStatusBadgeProps {
    status: ActivityStatus;
    onStatusChange: (newStatus: ActivityStatus) => void;
}
export default function ActivityStatusBadge({ status, onStatusChange }: ActivityStatusBadgeProps) {
    const [opened, setOpened] = useState(false);


    const getDisplayText = (status: ActivityStatus) => {
        return status.toLowerCase().replace('_', ' ');
    };

    const handleStatusChange = (newStatus: ActivityStatus) => {
        onStatusChange(newStatus);
        setOpened(false);
    };

    return (
        <Menu opened={opened} onChange={setOpened} position="bottom-start" withinPortal>
            <Menu.Target>
                <Badge
                    variant="light"
                    color={getActivityStatusVariant(status)}
                    className={classes.badge}
                    rightSection={<IconChevronDown size={12} />}
                >
                    {getDisplayText(status)}
                </Badge>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => handleStatusChange(ActivityStatus.COMPLETED)}
                    className={status === ActivityStatus.COMPLETED ? classes.activeItem : ''}
                >
                    Finished
                </Menu.Item>
                <Menu.Item
                    onClick={() => handleStatusChange(ActivityStatus.IN_PROGRESS)}
                    className={status === ActivityStatus.IN_PROGRESS ? classes.activeItem : ''}
                >
                    In Progress
                </Menu.Item>
                <Menu.Item
                    onClick={() => handleStatusChange(ActivityStatus.NOT_STARTED)}
                    className={status === ActivityStatus.NOT_STARTED ? classes.activeItem : ''}
                >
                    Not Started
                </Menu.Item>
                <Menu.Item
                    onClick={() => handleStatusChange(ActivityStatus.ABANDONED)}
                    className={status === ActivityStatus.ABANDONED ? classes.activeItem : ''}
                >
                    Abandoned
                </Menu.Item>
                <Menu.Item
                    onClick={() => handleStatusChange(ActivityStatus.ARCHIVED)}
                    className={status === ActivityStatus.ARCHIVED ? classes.activeItem : ''}
                >
                    Archived
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}