'use client';

import { Menu, ScrollArea, Text, UnstyledButton, rem } from '@mantine/core';
import { IconBell, IconCheck, IconSettings, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './NotificationsMenu.module.css';

const notifications = [
  {
    id: 1,
    title: 'New deployment successful',
    message: 'Your site was deployed to production environment',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: 2,
    title: 'Database backup completed',
    message: 'Weekly backup has been stored securely',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 3,
    title: 'System update available',
    message: 'New features and security patches ready to install',
    time: '1 day ago',
    read: true,
  },
];

export default function NotificationsMenu() {
  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationItems = notifications.map((notification) => (
    <Menu.Item
      key={notification.id}
      className={notification.read ? classes.notificationRead : classes.notification}
    >
      <div className={classes.notificationInner}>
        <div className={classes.notificationContent}>
          <Text size="sm" fw={600}>{notification.title}</Text>
          <Text size="xs" c="dimmed">{notification.message}</Text>
          <Text size="xs" c="dimmed" className={classes.timeStamp}>{notification.time}</Text>
        </div>
        <div className={classes.notificationActions}>
          <div className={classes.actionButton} title="Mark as read" role="button" tabIndex={0}>
            <IconCheck size={16} />
          </div>
          <div className={classes.actionButton} title="Delete notification" role="button" tabIndex={0}>
            <IconTrash size={16} />
          </div>
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
        <div className="notification-button icon-button">
          <IconBell size={20} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <div className={classes.header}>
          <Text fw={600} size="sm">Notifications</Text>
          {/* TODO: Link to notification settings */}
          <Link href={'settings'} className={classes.link}>
            <UnstyledButton className={classes.settingsButton}>
              <IconSettings size={16} />
            </UnstyledButton>
          </Link>
        </div>

        <ScrollArea h={rem(300)} scrollbarSize={6} type="auto">
          {notificationItems.length > 0 ? (
            notificationItems
          ) : (
            <Text ta="center" py="md" c="dimmed" size="sm">No notifications</Text>
          )}
        </ScrollArea>

        <div className={classes.footer}>
          <UnstyledButton className={classes.viewAllButton}>View all notifications</UnstyledButton>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
}
