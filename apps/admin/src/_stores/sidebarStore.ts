import { create } from 'zustand';

interface SidebarState {
    collapsed: boolean;
    isMobile: boolean;
    mobileOpen: boolean;
    toggleSidebar: () => void;
    setSidebar: (collapsed: boolean) => void;
    setIsMobile: (isMobile: boolean) => void;
    toggleMobileSidebar: () => void;
    setMobileSidebar: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    collapsed: false,
    isMobile: false,
    mobileOpen: false,
    toggleSidebar: () => set((state) => ({
        collapsed: !state.collapsed,
    })),
    setSidebar: (collapsed) => set({ collapsed }),
    setIsMobile: (isMobile) => set({ isMobile }),
    toggleMobileSidebar: () => set((state) => ({
        mobileOpen: !state.mobileOpen,
    })),
    setMobileSidebar: (open) => set({ mobileOpen: open }),
}));
