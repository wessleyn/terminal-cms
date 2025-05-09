'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconLayoutSidebarLeftCollapseFilled, IconLayoutSidebarLeftExpandFilled } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSidebarStore } from '../../_stores/sidebarStore';
import { sideBarTabs } from '../SideBar/sideBarTabs';
import classes from './SidebarToggle.module.css';

export default function SidebarToggle() {
    const {
        collapsed,
        isMobile,
        mobileOpen,
        secondaryOpen,
        toggleSidebar,
        toggleMobileSidebar,
        toggleSecondarySidebar
    } = useSidebarStore();
    const [hasSecondary, setHasSecondary] = useState(false);
    const pathname = usePathname();

    // Check if current path has secondary navigation
    useEffect(() => {
        const section = pathname.includes('/blog') ? 'blog' : 'portfolio';
        const tabs = sideBarTabs[section];

        const activeTab = tabs.find(tab => {
            if (tab.link === '/' && pathname === '/') return true;
            if (tab.link !== '/' && pathname.startsWith(tab.link)) return true;
            return false;
        });

        setHasSecondary(Boolean(activeTab?.secondary && activeTab.secondary.length > 0));
    }, [pathname]);

    const handleToggle = () => {
        if (hasSecondary) {
            // Toggle secondary sidebar
            toggleSecondarySidebar();
        } else if (isMobile) {
            toggleMobileSidebar();
        } else {
            toggleSidebar();
        }
    };

    // Get tooltip label based on context
    const getTooltipLabel = () => {
        if (hasSecondary) {
            return secondaryOpen ? "Show icons only" : "Expand sidebar";
        }

        if (isMobile) {
            return mobileOpen ? "Close sidebar" : "Open sidebar";
        }

        return collapsed ? "Expand sidebar" : "Collapse sidebar";
    };

    // Get the appropriate icon based on context
    const getIcon = () => {
        if (hasSecondary) {
            return secondaryOpen ? <IconLayoutSidebarLeftCollapseFilled size={25} /> : <IconLayoutSidebarLeftExpandFilled size={25} />;
        }

        if (isMobile) {
            return mobileOpen ? <IconLayoutSidebarLeftCollapseFilled size={25} /> : <IconLayoutSidebarLeftExpandFilled size={25} />;
        }

        return collapsed ? <IconLayoutSidebarLeftExpandFilled size={25} /> : <IconLayoutSidebarLeftCollapseFilled size={25} />;
    };

    // Determine if we should apply the secondary sidebar position styling
    // On desktop, even when secondary sidebar is collapsed, keep toggle in same position
    const shouldMoveRight = hasSecondary && !isMobile;

    return (
        <div className={`${classes.toggleWrapper} ${shouldMoveRight ? classes.withSecondary : ''}`}>
            <Tooltip
                label={getTooltipLabel()}
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
                    {getIcon()}
                </ActionIcon>
            </Tooltip>
        </div>
    );
}
