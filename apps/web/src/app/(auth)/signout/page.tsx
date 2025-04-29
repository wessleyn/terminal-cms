'use client';

import { SignOut } from '@repo/auth/src/utils';
import { Button, Center, Container, Paper, Text, Title } from '@repo/ui/components/mantine';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignOutPage() {
    const router = useRouter();

    useEffect(() => {
        // Automatically sign out when the page loads
        const performSignout = async () => {
            await SignOut();
        };
        performSignout();
    }, []);

    const goToHome = () => {
        router.push('/');
    };

    return (
        <Container size="sm" py="xl">
            <Paper radius="md" p="xl" withBorder shadow="md">
                <Center>
                    <Title order={2}>You&apos;ve been signed out</Title>
                </Center>

                <Text ta="center" mt="md" mb="xl" c="dimmed">
                    Thank you for visiting Wessley&apos;s Terminal Portfolio.
                </Text>

                <Center>
                    <Button onClick={goToHome} variant="light" radius="md">
                        Return to Home
                    </Button>
                </Center>
            </Paper>
        </Container>
    );
}