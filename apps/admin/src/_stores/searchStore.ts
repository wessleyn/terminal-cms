import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { create } from 'zustand';

interface SearchState {
    query: string;
    isSearchVisible: boolean;
    setQuery: (query: string) => void;
    showSearch: () => void;
    hideSearch: () => void;
    toggleSearch: () => void;
    resetQuery: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    query: '',
    isSearchVisible: true,
    setQuery: (query) => set({ query }),
    showSearch: () => set({ isSearchVisible: true }),
    hideSearch: () => set({ isSearchVisible: false }),
    toggleSearch: () => set((state) => ({ isSearchVisible: !state.isSearchVisible })),
    resetQuery: () => set({ query: '' }),
}));

// Create a separate hook for route change handling
// This must be used in a client component directly, not inside the store

// Hook to handle route changes
export function useSearchRouteHandler() {
    const pathname = usePathname();
    const resetQuery = useSearchStore((state) => state.resetQuery);

    useEffect(() => {
        // Reset query on route changes that aren't related
        // We could add more fine-grained control here
        const shouldResetQuery = !(
            pathname.includes('/blog/tags') ||
            pathname.includes('/projects') ||
            pathname.includes('/blog/posts') ||
            pathname.includes('/blog/comments')
        );

        if (shouldResetQuery) {
            resetQuery();
        }
    }, [pathname, resetQuery]);

    return null; // This hook doesn't render anything
}
