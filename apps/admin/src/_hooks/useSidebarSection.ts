import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Enum defining the available sidebar sections
 * @enum {string}
 */
export enum SidebarSection {
    /** Portfolio section of the application */
    PORTFOLIO = 'portfolio',
    /** Blog section of the application */
    BLOG = 'blog',
}

/**
 * Hook for managing sidebar section state.
 * 
 * This hook provides state and functionality for tracking which section of the
 * sidebar is active (Portfolio or Blog). It automatically determines the section
 * based on the current URL path and provides methods to toggle or set the section.
 * 
 * @example
 * ```tsx
 * const { section, setSection, toggleSection } = useSidebarSection();
 * 
 * // Use section value
 * console.log(section === SidebarSection.PORTFOLIO ? 'In Portfolio' : 'In Blog');
 * 
 * // Manually set section
 * setSection(SidebarSection.BLOG);
 * 
 * // Toggle between sections
 * toggleSection();
 * ```
 * 
 * @returns {Object} An object containing the current section and functions to manipulate it
 * @returns {SidebarSection} .section - Current active section (PORTFOLIO or BLOG)
 * @returns {Function} .setSection - Function to directly set the active section
 * @returns {Function} .toggleSection - Function to toggle between Portfolio and Blog sections
 */
export function useSidebarSection() {
    const [section, setSection] = useState<SidebarSection>(SidebarSection.PORTFOLIO);
    const pathname = usePathname();

    // Determine which section we're in based on the URL
    useEffect(() => {
        if (pathname.includes('/blog')) {
            setSection(SidebarSection.BLOG);
        } else {
            setSection(SidebarSection.PORTFOLIO);
        }
    }, [pathname]);

    /**
     * Toggle between Portfolio and Blog sections
     */
    const toggleSection = () => {
        setSection(section === SidebarSection.PORTFOLIO ? SidebarSection.BLOG : SidebarSection.PORTFOLIO);
    };

    return { section, setSection, toggleSection };
}
