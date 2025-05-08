'use client'

import useHasSession from '@hooks/useHasSession'
import { ActionIcon, Autocomplete, Burger, Divider, Group, Title } from "@repo/ui/components/mantine"
import { IconMoon, IconSearch, IconSun } from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import classes from '../layout.module.css'
import BlogLogo from "./BlogLogo"

const Header = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const pathname = usePathname();
    const hasSession = useHasSession()
    const isDark = theme === 'dark';
    
    // Initialize theme from localStorage or system preference
    useEffect(() => {
        // Check localStorage
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme as 'light' | 'dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }

        // Apply theme class to root
        document.documentElement.classList.toggle('dark-theme', isDark);
    }, [isDark]);

    // Set favicon based on path and theme
    useEffect(() => {
        // Only set favicon when on blog routes
        if (pathname.startsWith('/blog')) {
            const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            if (link) {
                link.href = isDark ? '/blog-dark.svg' : '/blog-light.svg';
            }
        }
    }, [pathname, isDark]);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark-theme', !isDark);

        // Update favicon if on blog routes
        if (pathname.startsWith('/blog')) {
            const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            if (link) {
                link.href = !isDark ? '/blog-dark.svg' : '/blog-light.svg';
            }
        }
    };

    return (
        <div className={classes.inner}>
                <Link href='/blog' className={classes.link + 'd-flex'}>
            <Group>
                <Burger size="sm" hiddenFrom="sm" />
                    <BlogLogo />
                    <Title order={2} className={classes.title}>Blog</Title>
            </Group>
                </Link>
            <Group>
            </Group>
            <Autocomplete
                className={classes.search}
                placeholder="Search"
                leftSection={<IconSearch size={18} stroke={1.5} />}
                data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
                visibleFrom="md"
                size="md"
                style={{ width: '300px' }}
            />
            <Group>
                <ActionIcon
                    variant="outline"
                    color={isDark ? 'yellow' : 'blue'}
                    onClick={toggleTheme}
                    title={isDark ? 'Light mode' : 'Dark mode'}
                >
                    {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
                </ActionIcon>
                <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
                    {
                        links.map((link) => (
                            <Link
                                key={link.label}
                                href={link.link}
                                className={classes.link}
                            >
                                {link.label}
                            </Link>
                        ))
                    }
                </Group>
                <Divider orientation='vertical' />
                <Group>
                    {
                        hasSession ? (
                            <Link
                                href={'/dashboard'}
                                className={classes.link}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={'/login'}
                                className={classes.link}
                            >
                                Register
                            </Link>
                        )
                    }
                </Group>
            </Group>
        </div>
    )
}
// TODO: add animation and icons of fumes and other related effects to these routes
const links = [
    { link: '/blog/category/potions', label: 'Potions' },
    { link: '/blog/category/spells', label: 'Spells' },
    { link: '/blog/category/scrolls', label: 'Scrolls' },
    { link: '/blog/category/artifacts', label: 'Artifacts' },
];

export default Header