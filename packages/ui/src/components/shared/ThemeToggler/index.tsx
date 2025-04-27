'use client';

import { ActionIcon } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import cx from 'clsx';
import useThemeToggle from '../../../hooks/useThemeToggle';
import classes from './ThemeToggler.module.css';

export default function ThemeToggler() {
    const { toggleColorScheme } = useThemeToggle();

    return (
        <div className={classes.togglerWrapper}>
            <ActionIcon
                onClick={toggleColorScheme}
                variant="default"
                size="xl"
                aria-label="Toggle color scheme"
            >
                <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
                <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
            </ActionIcon>
        </div>
    );
}
