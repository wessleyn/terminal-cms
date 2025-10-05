'use client';

import { Avatar, Loader, Menu, Text, UnstyledButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getCurrentUser, SignOut } from '@repo/auth/src/utils';
import { IconLogout, IconSettings, IconSwitchHorizontal } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserSession = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export default function ProfileMenu() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const userData = await getCurrentUser();
        // Ensure userData has an id before setting it as session
        if (userData && userData.id) {
          setSession({
            id: userData.id,
            name: userData.name || null,
            email: userData.email || null,
            image: 'image' in userData ? userData.image : null,
            role: userData.role
          });
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const result = await SignOut('/login');

      if (result.success) {
        // Show success notification
        notifications.show({
          title: 'Signed out successfully',
          message: 'You have been signed out of your account',
          color: 'green',
        });

        // Redirect to login page
        router.push('/login');
      } else {
        // Show error notification
        notifications.show({
          title: 'Sign out failed',
          message: result.error || 'Failed to sign out. Please try again.',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      notifications.show({
        title: 'Sign out failed',
        message: 'An unexpected error occurred. Please try again.',
        color: 'red',
      });
    } finally {
      setIsSigningOut(false);
    }
  };


  if (isLoading) {
    return (
      <div className="profile-button" style={{ display: 'flex', alignItems: 'center' }}>
        <Loader size="sm" />
      </div>
    );
  }

  return (
    <Menu
      width={200}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className="profile-button">
          <div className="profile-info">
            <Avatar src={session?.image} alt={'profile'} radius="xl" size={36} />
            <div className="profile-details">
              <Text size="sm" fw={500}>{session?.name || 'User'}</Text>
              <Text c="dimmed" size="xs">{session?.role || 'Loading...'}</Text>
            </div>
          </div>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconSettings size={14} />}>
          Account settings
        </Menu.Item>
        <Menu.Item leftSection={<IconSwitchHorizontal size={14} />}>
          Change account
        </Menu.Item>
        <Menu.Item
          leftSection={<IconLogout size={14} />}
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? 'Signing out...' : 'Logout'}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}