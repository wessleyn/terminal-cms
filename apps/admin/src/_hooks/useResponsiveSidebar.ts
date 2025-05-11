import { useEffect } from 'react';
import { SidebarItemWithSecondary } from '../_components/SideBar/types';
import { useSidebarStore } from '../_stores/sidebarStore';

/**
 * Hook for handling responsive sidebar behavior.
 * 
 * This hook manages the responsive behavior of the sidebar based on screen size
 * and the presence of a secondary navigation. It automatically:
 * 
 * - Detects mobile/tablet/desktop screen sizes
 * - Sets the sidebar collapsed state appropriately for each screen size
 * - Handles special cases when secondary navigation is present
 * 
 * @param {SidebarItemWithSecondary|null} activeTabWithSecondary - Currently active tab with secondary navigation, if any
 * 
 * @example
 * ```tsx
 * const { activeTabWithSecondary } = useSidebarNavigation(section);
 * 
 * // Setup responsive sidebar behavior
 * useResponsiveSidebar(activeTabWithSecondary);
 * ```
 * 
 * @remarks
 * This hook adds a window resize event listener and cleans it up on unmount.
 * 
 * Screen size breakpoints:
 * - Mobile: < 768px
 * - Tablet: >= 768px and < 992px
 * - Desktop: >= 992px
 */
export function useResponsiveSidebar(activeTabWithSecondary: SidebarItemWithSecondary | null) {
    const { setIsMobile, setSidebar } = useSidebarStore();

    useEffect(() => {
        /**
         * Check window dimensions and update sidebar state accordingly
         */
        const checkMobile = () => {
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;

            setIsMobile(isMobile);

            // Set collapsed state based on screen size
            if (isTablet || activeTabWithSecondary) {
                setSidebar(true); // Collapsed on tablet or when there's secondary nav
            } else if (!isMobile) {
                setSidebar(false); // Expanded on desktop
            }
        };

        // Run once on component mount
        checkMobile();

        // Set up event listener for window resize
        window.addEventListener('resize', checkMobile);

        // Clean up event listener on unmount
        return () => window.removeEventListener('resize', checkMobile);
    }, [setSidebar, setIsMobile, activeTabWithSecondary]);
}
