import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sideBarTabs } from '../_components/SideBar/sideBarTabs';
import { SidebarItemWithSecondary } from '../_components/SideBar/types';
import { useSidebarStore } from '../_stores/sidebarStore';
import { SidebarSection } from './useSidebarSection';

/**
 * Hook for handling sidebar navigation state and logic.
 * 
 * This hook manages the state related to the active navigation item in the sidebar.
 * It tracks which item is active based on the current URL and determines if the active
 * item has a secondary navigation that should be displayed.
 * 
 * @param {SidebarSection} section - The current active section (Portfolio or Blog)
 * 
 * @example
 * ```tsx
 * const { section } = useSidebarSection();
 * const { active, activeTabWithSecondary } = useSidebarNavigation(section);
 * 
 * // Check if we have an active tab with secondary navigation
 * if (activeTabWithSecondary) {
 *   // Render secondary navigation
 * }
 * ```
 * 
 * @returns {Object} An object containing active navigation state
 * @returns {string} .active - The label of the currently active navigation item
 * @returns {SidebarItemWithSecondary|null} .activeTabWithSecondary - The active navigation item with secondary nav, or null
 */
export function useSidebarNavigation(section: SidebarSection) {
    const [active, setActive] = useState('');
    const [activeTabWithSecondary, setActiveTabWithSecondary] = useState<SidebarItemWithSecondary | null>(null);
    const pathname = usePathname();
    const { setSidebar } = useSidebarStore();

    // Update active state based on current pathname and section
    useEffect(() => {
        // Get the current tabs based on our section
        const tabs = sideBarTabs[section];

        // Find the active tab by checking if its link is part of the current path
        const foundActiveTab = tabs.find(tab => {
            // Special case for dashboard/blog root
            if ((tab.label === 'Dashboard' && tab.link === '/dashboard' && pathname === '/dashboard') ||
                (tab.label === 'Dashboard' && tab.link === '/blog' && pathname === '/blog')) {
                return true;
            }

            // Check if the current path matches or is a sub-path of this link (except Dashboard)
            if (tab.link !== '/' && tab.label !== 'Dashboard' && pathname.startsWith(tab.link)) {
                return true;
            }

            // Exact match as fallback
            return pathname === tab.link;
        });

        if (foundActiveTab) {
            setActive(foundActiveTab.label);

            // Check if active tab has secondary navigation
            if (foundActiveTab.secondary !== undefined) {
                setActiveTabWithSecondary(foundActiveTab);
                setSidebar(true); // Force collapse main sidebar when secondary nav is present
            } else {
                setActiveTabWithSecondary(null);
            }
        }
    }, [pathname, section, setSidebar]);

    return { active, activeTabWithSecondary };
}
