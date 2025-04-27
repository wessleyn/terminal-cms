'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import useThemeToggle from '../../../../../packages/ui/src/hooks/useThemeToggle';
import classes from './DashboardThemeToggler.module.css';

export default function DashboardThemeToggler() {
    const { colorScheme, toggleColorScheme } = useThemeToggle();

    return (
        <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'} position="bottom" withArrow>
            <ActionIcon
                onClick={toggleColorScheme}
                variant="subtle"
                className="icon-button"
                aria-label="Toggle color scheme"
                color="green"
            >
                {colorScheme === 'dark' ? (
                    <IconSun size={20} className={classes.icon} />
                ) : (
                    <IconMoon size={20} className={classes.icon} />
                )}
            </ActionIcon>
        </Tooltip>
    );
}
