'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconLayoutSidebarLeftCollapseFilled, IconLayoutSidebarLeftExpandFilled } from '@tabler/icons-react';
import { useSidebarStore } from '../../_stores/sidebarStore';
import classes from './SidebarToggle.module.css';

export default function SidebarToggle() {
    const { collapsed, isMobile, mobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebarStore();

    const handleToggle = () => {
        if (isMobile) {
            toggleMobileSidebar();
        } else {
            toggleSidebar();
        }
    };

    return (
        <Tooltip
            label={isMobile ? (mobileOpen ? "Close sidebar" : "Open sidebar") : (collapsed ? "Expand sidebar" : "Collapse sidebar")}
            position="right"
            withArrow
        >
            <ActionIcon
                onClick={handleToggle}
                variant="subtle"
                className={classes.toggleButton}
                size="lg"
                color="green"
                aria-label="Toggle sidebar"
            >
                {isMobile ? (
                    mobileOpen ? <IconLayoutSidebarLeftCollapseFilled size={25} /> : <IconLayoutSidebarLeftExpandFilled size={25} />
                ) : (
                    collapsed ? <IconLayoutSidebarLeftExpandFilled size={25} /> : <IconLayoutSidebarLeftCollapseFilled size={25} />
                )}
            </ActionIcon>
        </Tooltip>
    );
}
