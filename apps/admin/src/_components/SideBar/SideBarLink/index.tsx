'use client';

import { Badge, Tooltip, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import { IconComponent } from '../types';
import styles from './SideBarLink.module.css';

interface SideBarLinkProps {
    icon: IconComponent;
    label: string;
    link: string;
    active?: boolean;
    onClick: (event: React.MouseEvent) => void;
    isCollapsed: boolean;
    showLabel?: boolean;
    badge?: number; // Badge count
    badgeColor?: string; // Badge color
    className?: string; // Additional class name
}

function SideBarLink({
    icon: Icon,
    label,
    link,
    active,
    onClick,
    isCollapsed,
    showLabel = false,
    badge,
    badgeColor = "blue",
    className = ""
}: SideBarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }} disabled={!isCollapsed || showLabel}>
            <Link href={link} passHref>
                <UnstyledButton
                    onClick={onClick}
                    className={`${styles.link} ${isCollapsed && !showLabel ? styles.collapsedLink : ''} ${className}`}
                    styles={{
                        root: {
                            padding: isCollapsed && !showLabel ? '12px' : '8px 16px',
                            width: isCollapsed && !showLabel ? '50px' : 'auto',
                            height: isCollapsed && !showLabel ? '50px' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed && !showLabel ? 'center' : 'space-between',
                        }
                    }}
                    data-active={active || undefined}
                >
                    <div className={styles.linkContent}>
                        <Icon className={styles.linkIcon} stroke={1.5} />
                        {(!isCollapsed || showLabel) && <span className={styles.linkLabel}>{label}</span>}
                    </div>

                    {(!isCollapsed || showLabel) && badge !== undefined && (
                        <Badge
                            size="sm"
                            variant="filled"
                            color={badgeColor}
                            className={styles.linkBadge}
                        >
                            {badge}
                        </Badge>
                    )}
                </UnstyledButton>
            </Link>
        </Tooltip>
    );
}

export default SideBarLink;
