'use client'
import { ActionIcon, Text, Tooltip } from '@mantine/core';
import { ReactNode } from 'react';
import classes from '../ProjectCard.module.css';

interface EngagementButtonProps {
    label: string;
    count: number;
    onAction: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    icon: ReactNode;
    color: string;
}

const largeIconStyle = {
    minWidth: '42px',
    minHeight: '42px',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const EngagementButton = ({
    label,
    count,
    onAction,
    onMouseEnter,
    onMouseLeave,
    icon,
    color,
}: EngagementButtonProps) => {
    return (
        <Tooltip label={label} withArrow position="top">
            <ActionIcon
                className={`${classes.action} d-flex gap-2`}
                onClick={onAction}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                size={48}
                radius="md"
                variant="light"
                bg="transparent"
                color={color}
                style={largeIconStyle}
            >
                {icon}
                <Text size='md'>{count}</Text>
            </ActionIcon>
        </Tooltip>
    );
};

export default EngagementButton;
