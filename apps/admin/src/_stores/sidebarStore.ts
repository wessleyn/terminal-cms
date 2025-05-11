import { create } from 'zustand';

/**
 * Interface defining the shape of the sidebar state and actions
 */
interface SidebarState {
    /** Whether the sidebar is collapsed */
    collapsed: boolean;
    /** Whether the app is in mobile view mode */
    isMobile: boolean;
    /** Whether the mobile sidebar is open */
    mobileOpen: boolean;
    /** Whether the secondary sidebar is open */
    secondaryOpen: boolean;
    /** Toggle the sidebar between collapsed and expanded states */
    toggleSidebar: () => void;
    /** Set the sidebar to a specific collapsed state */
    setSidebar: (collapsed: boolean) => void;
    /** Set the mobile mode state */
    setIsMobile: (isMobile: boolean) => void;
    /** Toggle the mobile sidebar between open and closed states */
    toggleMobileSidebar: () => void;
    /** Set the mobile sidebar to a specific open state */
    setMobileSidebar: (open: boolean) => void;
    /** Set the secondary sidebar to a specific open state */
    setSecondarySidebar: (open: boolean) => void;
    /** Toggle the secondary sidebar between open and closed states */
    toggleSecondarySidebar: () => void;
}

/**
 * Zustand store for managing sidebar state across the application.
 * 
 * This store provides state and actions related to the sidebar UI, including:
 * - Collapsed/expanded state
 * - Mobile view state
 * - Mobile sidebar open/closed state
 * - Secondary sidebar open/closed state
 * 
 * @example
 * ```tsx
 * const { 
 *   collapsed, 
 *   isMobile, 
 *   toggleSidebar,
 *   setMobileSidebar 
 * } = useSidebarStore();
 * 
 * // Check if sidebar is collapsed
 * console.log(collapsed ? 'Collapsed' : 'Expanded');
 * 
 * // Toggle sidebar state
 * toggleSidebar();
 * 
 * // Close mobile sidebar
 * setMobileSidebar(false);
 * ```
 */
export const useSidebarStore = create<SidebarState>((set) => ({
    collapsed: false,
    isMobile: false,
    mobileOpen: false,
    secondaryOpen: true,
    toggleSidebar: () => set((state) => ({
        collapsed: !state.collapsed,
    })),
    setSidebar: (collapsed) => set({ collapsed }),
    setIsMobile: (isMobile) => set({ isMobile }),
    toggleMobileSidebar: () => set((state) => ({
        mobileOpen: !state.mobileOpen,
    })),
    setMobileSidebar: (open) => set({ mobileOpen: open }),
    setSecondarySidebar: (open) => set({ secondaryOpen: open }),
    toggleSecondarySidebar: () => set((state) => ({
        secondaryOpen: !state.secondaryOpen,
    })),
}));
