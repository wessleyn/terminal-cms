import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';

export function useThemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    // Sync Bootstrap theme with Mantine theme
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', computedColorScheme);
    }, [computedColorScheme]);

    const toggleColorScheme = () => {
        const newColorScheme = computedColorScheme === 'light' ? 'dark' : 'light';
        setColorScheme(newColorScheme);
        document.documentElement.setAttribute('data-bs-theme', newColorScheme);
    };

    return {
        colorScheme: computedColorScheme,
        toggleColorScheme,
    };
}
