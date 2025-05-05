import { create } from 'zustand';

interface SidebarState {
    collapsed: boolean;
    isMobile: boolean;
    mobileOpen: boolean;
    secondaryOpen: boolean;
    toggleSidebar: () => void;
    setSidebar: (collapsed: boolean) => void;
    setIsMobile: (isMobile: boolean) => void;
    toggleMobileSidebar: () => void;
    setMobileSidebar: (open: boolean) => void;
    setSecondarySidebar: (open: boolean) => void;
    toggleSecondarySidebar: () => void;
}

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
