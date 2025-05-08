'use client';

import { Tooltip, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import React from 'react';
import styles from '../styles/Sidebar.module.css';
import { IconComponent } from './types';

interface SideBarLinkProps {
    icon: IconComponent;
    label: string;
    link: string;
    active?: boolean;
    onClick: (event: React.MouseEvent) => void;
    isCollapsed: boolean;
    showLabel?: boolean;
}

function SideBarLink({ icon: Icon, label, link, active, onClick, isCollapsed, showLabel = false }: SideBarLinkProps) {
    console.log(`Rendering SideBarLink: ${label}, isCollapsed: ${isCollapsed}, showLabel: ${showLabel}`);
    console.log(`is Linka ctive: ${active} `);
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }} disabled={!isCollapsed || showLabel}>
            <Link href={link} passHref>
                <UnstyledButton
                    onClick={onClick}
                    className={styles.link}
                    styles={{
                        root: {
                            padding: isCollapsed && !showLabel ? '12px' : '8px 16px',
                            width: isCollapsed && !showLabel ? '50px' : 'auto',
                            height: isCollapsed && !showLabel ? '50px' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed && !showLabel ? 'center' : 'flex-start',
                        }
                    }}
                    data-active={active || undefined}
                >
                    <Icon className={styles.linkIcon} stroke={1.5} />
                    {(!isCollapsed || showLabel) && <span className={styles.linkLabel}>{label}</span>}
                </UnstyledButton>
            </Link>
        </Tooltip>
    );
}

export default SideBarLink;
