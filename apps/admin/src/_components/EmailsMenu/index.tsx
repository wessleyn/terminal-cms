'use client';

import { Avatar, Menu, ScrollArea, Text, UnstyledButton, rem } from '@mantine/core';
import { IconArchive, IconMail, IconStar, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './EmailsMenu.module.css';

const emails = [
    {
        id: 1,
        sender: 'GitHub',
        avatar: 'https://github.githubassets.com/favicons/favicon.png',
        subject: 'New pull request opened',
        preview: 'User has opened PR #123 in repository',
        time: '14 minutes ago',
        unread: true,
    },
    {
        id: 2,
        sender: 'Vercel',
        avatar: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
        subject: 'Deployment complete',
        preview: 'Your project has been deployed successfully',
        time: '1 hour ago',
        unread: true,
    },
    {
        id: 3,
        sender: 'Auth0',
        avatar: 'https://cdn.auth0.com/website/new-homepage/dark-favicon.png',
        subject: 'Security alert',
        preview: 'A new sign-in was detected from an unknown device',
        time: 'Yesterday',
        unread: false,
    },
];

export default function EmailsMenu() {
    const unreadCount = emails.filter(email => email.unread).length;

    const emailItems = emails.map((email) => (
        <Menu.Item
            key={email.id}
            className={email.unread ? classes.emailUnread : classes.email}
        >
            <div className={classes.emailInner}>
                <Avatar src={email.avatar} size="sm" radius="xl" className={classes.emailAvatar} />
                <div className={classes.emailContent}>
                    <div className={classes.emailHeader}>
                        <Text size="sm" fw={600}>{email.sender}</Text>
                        <Text size="xs" c="dimmed">{email.time}</Text>
                    </div>
                    <Text size="xs" fw={500} lineClamp={1}>{email.subject}</Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>{email.preview}</Text>
                </div>
            </div>
            <div className={classes.emailActions}>
                <div className={classes.actionButton} title="Star" role="button" tabIndex={0}>
                    <IconStar size={16} />
                </div>
                <div className={classes.actionButton} title="Archive" role="button" tabIndex={0}>
                    <IconArchive size={16} />
                </div>
                <div className={classes.actionButton} title="Delete" role="button" tabIndex={0}>
                    <IconTrash size={16} />
                </div>
            </div>
        </Menu.Item>
    ));

    return (
        <Menu
            position="bottom-end"
            withArrow
            width={320}
            shadow="md"
            classNames={{
                dropdown: classes.dropdown,
            }}
        >
            <Menu.Target>
                <div className="icon-button">
                    <IconMail size={20} />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </div>
            </Menu.Target>

            <Menu.Dropdown>
                <div className={classes.header}>
                    <Link href={'emails/inbox'} className={classes.inboxText}>
                        <Text fw={600} size="sm">Inbox</Text>
                    </Link>
                    <Text size="xs" c="dimmed">{unreadCount} unread</Text>
                </div>

                <ScrollArea h={rem(320)} scrollbarSize={6} type="auto">
                    {emailItems.length > 0 ? (
                        emailItems
                    ) : (
                        <Text ta="center" py="md" c="dimmed" size="sm">No messages</Text>
                    )}
                </ScrollArea>

                <div className={classes.footer}>
                    <UnstyledButton className={classes.viewAllButton}>View all messages</UnstyledButton>
                </div>
            </Menu.Dropdown>
        </Menu>
    );
}
