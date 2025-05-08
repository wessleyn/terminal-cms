'use client';

import { Avatar, Button, Group, Skeleton, Text } from '@mantine/core';
import { checkUserSession } from '@repo/auth/src/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './SessionContinue.module.css';

interface SessionUser {
    id: string;
    name: string | null | undefined;
    email: string | null | undefined;
    image: string | null | undefined;
    role: string | null | undefined;
}

export default function SessionContinue({ callbackUrl = '/dashboard' }: { callbackUrl?: string }) {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for existing session
        async function fetchSession() {
            try {
                const sessionUser = await checkUserSession();
                if (sessionUser && sessionUser.id) {
                    setUser({
                        id: sessionUser.id,
                        name: sessionUser.name || null,
                        email: sessionUser.email || null,
                        image: sessionUser.image || null,
                        role: sessionUser.role || null
                    });

                    // Prefetch the route as soon as we detect a valid session
                    router.prefetch(callbackUrl);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSession();
    }, [router, callbackUrl]);

    const handleContinue = () => {
        setRedirecting(true);
        // Add slight delay before redirect to show the skeleton
        // Since we're prefetching, the actual navigation will be faster
        setTimeout(() => {
            router.push(callbackUrl);
        }, 300);
    };

    // Don't render anything if still loading or no user found
    if (loading || !user) return null;

    // Show skeleton when redirecting
    if (redirecting) {
        return (
            <div className={styles.container}>
                <Skeleton height={50} width={240} radius="lg" />
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${styles.blinkIn}`}>
            <Button
                onClick={handleContinue}
                leftSection={
                    user?.image ? (
                        <Avatar src={user.image} size="sm" radius="xl" />
                    ) : (
                        <Avatar color="green" size="sm" radius="xl">
                            {user?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
                        </Avatar>
                    )
                }
                variant="light"
                color="green"
                radius="lg"
                className={styles.button}
            >
                <Group gap="xs">
                    <Text size="sm">Continue as</Text>
                    <Text fw={700} size="sm">
                        {user?.name || user?.email?.split('@')[0]}
                    </Text>
                </Group>
            </Button>
        </div>
    );
}