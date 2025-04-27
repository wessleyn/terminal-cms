'use client';

import { Badge, Menu } from '@mantine/core';
import { PublishStatus } from '@repo/db';
import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './PublishStatusBadge.module.css';
import { getPublishStatusVariant } from './getPublishStatusVariant';

interface PublishStatusBadgeProps {
    status: PublishStatus;
    onStatusChange: (newStatus: PublishStatus) => void;
}

export default function PublishStatusBadge({ status, onStatusChange }: PublishStatusBadgeProps) {
    const [opened, setOpened] = useState(false);


    const getDisplayText = (status: PublishStatus) => {
        return status.toLowerCase().replace('_', ' ');
    };

    const handleStatusChange = (newStatus: PublishStatus) => {
        onStatusChange(newStatus);
        setOpened(false);
    };

    return (
        <Menu opened={opened} onChange={setOpened} position="bottom-start" withinPortal>
            <Menu.Target>
                <Badge
                    variant="light"
                    color={getPublishStatusVariant(status)}
                    className={classes.badge}
                    rightSection={<IconChevronDown size={12} />}
                >
                    {getDisplayText(status)}
                </Badge>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => handleStatusChange(PublishStatus.PUBLISHED)}
                    className={status === PublishStatus.PUBLISHED ? classes.activeItem : ''}
                >
                    Published
                </Menu.Item>
                <Menu.Item
                    onClick={() => handleStatusChange(PublishStatus.ARCHIVED)}
                    className={status === PublishStatus.ARCHIVED ? classes.activeItem : ''}
                >
                    Archived
                </Menu.Item>
                <Menu.Item
                    onClick={() => handleStatusChange(PublishStatus.DRAFT)}
                    className={status === PublishStatus.DRAFT ? classes.activeItem : ''}
                >
                    Draft
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}