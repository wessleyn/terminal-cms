'use client'

import { ActionIcon, Container, Divider, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter, IconCode, IconRss } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const links = [
        { label: 'Home', link: '/blog' },
        { label: 'RSS Feed', link: '/blog/feed.xml' },
        { label: 'Sitemap', link: '/blog/sitemap.xml' },
        { label: 'Privacy Policy', link: '/privacy' },
        { label: 'Terms of Service', link: '/terms' },
    ];

    return (
        <footer className={classes.footer}>
            <Container size="xl">
                <div className={classes.inner}>
                    <div className={classes.logo}>
                        <Group gap="xs" align="center">
                            <ThemeIcon size="md" variant="light" radius="xl">
                                <IconCode size={18} stroke={1.5} />
                            </ThemeIcon>
                            <Text fw={700} size="lg">Terminal Blog</Text>
                        </Group>
                        <Text c="dimmed" size="xs" mt="sm" className={classes.description}>
                            A collection of tech insights, coding adventures, and software development tips
                        </Text>
                    </div>

                    <Stack gap="xs" className={classes.links}>
                        <Text fw={700} size="sm" className={classes.title}>Quick Links</Text>
                        <Group gap="md" className={classes.linkGroup}>
                            {links.map((link) => (
                                <Link key={link.label} href={link.link} className={classes.link}>
                                    {link.label}
                                </Link>
                            ))}
                        </Group>
                    </Stack>
                </div>

                <Divider my="sm" />

                <div className={classes.afterFooter}>
                    <Text c="dimmed" size="sm">
                        © {currentYear} Wessley Nyakanyanga. All rights reserved.
                    </Text>

                    <Group gap="xs">
                        <Link href="/blog/feed.xml" passHref target="_blank">
                            <ActionIcon size="md" variant="subtle" color="orange" title="RSS Feed">
                                <IconRss size={16} stroke={1.5} />
                            </ActionIcon>
                        </Link>
                        <Link href="https://github.com/wessleyn" passHref target="_blank">
                            <ActionIcon size="md" variant="subtle" color="gray" title="GitHub">
                                <IconBrandGithub size={16} stroke={1.5} />
                            </ActionIcon>
                        </Link>
                        <Link href="https://twitter.com/wessleyn" passHref target="_blank">
                            <ActionIcon size="md" variant="subtle" color="blue" title="Twitter">
                                <IconBrandTwitter size={16} stroke={1.5} />
                            </ActionIcon>
                        </Link>
                        <Link href="https://linkedin.com/in/wessleyn" passHref target="_blank">
                            <ActionIcon size="md" variant="subtle" color="indigo" title="LinkedIn">
                                <IconBrandLinkedin size={16} stroke={1.5} />
                            </ActionIcon>
                        </Link>
                    </Group>
                </div>
            </Container>
        </footer>
    );
}