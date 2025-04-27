'use client';

import { useThemeToggle } from '@hooks/useThemeToggle';
import { ActionIcon } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './ThemeToggler.module.css';

const ThemeToggler = () => {
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

export default ThemeToggler;