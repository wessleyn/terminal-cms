'use client';

import { Avatar, Menu, ScrollArea, Text, UnstyledButton, rem } from '@mantine/core';
import { IconArchive, IconArchiveFilled, IconMail, IconStar, IconStarFilled, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import updateMail from '../../app/emails/_actions/updateMail';
import classes from './EmailsMenu.module.css';

interface EmailUser {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

interface EmailItem {
    id: string;
    fromId: string;
    from: EmailUser;
    subject: string;
    body: string;
    isRead: boolean;
    isArchived: boolean;
    isTrash: boolean;
    isStarred: boolean;
    isSpam: boolean;
    receivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function EmailsMenu({ mails }: { mails: EmailItem[] }) {
    const [emailList, setEmailList] = useState<EmailItem[]>(mails);

    const handleAction = async (action: 'star' | 'archive' | 'delete', emailId: string) => {
        const email = emailList.find(mail => mail.id === emailId);
        if (!email) return;

        try {
            switch (action) {
                case 'star':
                    await updateMail({
                        id: emailId,
                        isStarred: !email.isStarred,
                        isArchived: email.isArchived,
                        isTrash: email.isTrash,
                        isRead: email.isRead,
                        isSpam: email.isSpam
                    });
                    setEmailList(prev => prev.map(mail =>
                        mail.id === emailId ? { ...mail, isStarred: !mail.isStarred } : mail
                    ));
                    break;
                case 'archive':
                    await updateMail({
                        id: emailId,
                        isStarred: email.isStarred,
                        isArchived: true,
                        isTrash: email.isTrash,
                        isRead: email.isRead,
                        isSpam: email.isSpam
                    });
                    setEmailList(prev => prev.filter(mail => mail.id !== emailId));
                    break;
                case 'delete':
                    await updateMail({
                        id: emailId,
                        isStarred: email.isStarred,
                        isArchived: email.isArchived,
                        isTrash: true,
                        isRead: email.isRead,
                        isSpam: email.isSpam
                    });
                    setEmailList(prev => prev.filter(mail => mail.id !== emailId));
                    break;
            }
        } catch (error) {
            console.error('Failed to update email:', error);
        }
    };

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
                    {emailList.length > 0 && <span className="notification-badge">{emailList.length}</span>}
                </div>
            </Menu.Target>

            <Menu.Dropdown>
                <div className={classes.header}>
                    <Link href={'emails/inbox'} className={classes.inboxText}>
                        <Text fw={600} size="sm">Inbox</Text>
                    </Link>
                    <Text size="xs" c="dimmed">{emailList.length} unread</Text>
                </div>

                <ScrollArea h={rem(320)} scrollbarSize={6} type="auto">
                    {emailList.length > 0 ? (
                        emailList.map((email) => (
                            <Menu.Item
                                key={email.id}
                                className={!email.isRead ? classes.emailUnread : classes.email}
                            >
                                <div className={classes.emailInner}>
                                    <Avatar
                                        src={null}
                                        size="sm"
                                        radius="xl"
                                        className={classes.emailAvatar}
                                        color="green"
                                    >
                                        {email.from.name ? email.from.name.charAt(0).toUpperCase() : email.from.email.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <div className={classes.emailContent}>
                                        <div className={classes.emailHeader}>
                                            <Text size="sm" fw={600}>{email.from.name || email.from.email}</Text>
                                            <Text size="xs" c="dimmed">{email.receivedAt ? new Date(email.receivedAt).toLocaleTimeString() : 'N/A'}</Text>
                                        </div>
                                        <Text size="xs" fw={500} lineClamp={1}>{email.subject}</Text>
                                        <Text size="xs" c="dimmed" lineClamp={1}>{email.body.substring(0, 50)}...</Text>
                                    </div>
                                </div>
                                <div className={classes.emailActions}>
                                    <UnstyledButton
                                        className={classes.actionButton}
                                        title={email.isStarred ? 'Unstar' : 'Star'}
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAction('star', email.id);
                                        }}
                                    >
                                        {
                                            email.isStarred ? <IconStarFilled color='green'  size={16} /> : <IconStar size={16} />
                                        }
                                    </UnstyledButton>
                                    <UnstyledButton
                                        className={classes.actionButton}
                                        title="Archive"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAction('archive', email.id);
                                        }}
                                    >
                                        {
                                            email.isArchived ? <IconArchiveFilled color='green' size={16} /> : <IconArchive size={16} />
 
                                        }
                                    </UnstyledButton>
                                    <UnstyledButton
                                        className={classes.actionButton}
                                        title="Delete"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAction('delete', email.id);
                                        }}
                                    >
                                        <IconTrash size={16} />
                                    </UnstyledButton>
                                </div>
                            </Menu.Item>
                        ))
                    ) : (
                        <Text ta="center" py="md" c="dimmed" size="sm">No messages</Text>
                    )}
                </ScrollArea>

                <div className={classes.footer}>
                    <Link href="/emails" >
                        <UnstyledButton component="span" className={classes.viewAllButton}>View all messages</UnstyledButton>
                    </Link>
                </div>
            </Menu.Dropdown>
        </Menu>
    );
}
