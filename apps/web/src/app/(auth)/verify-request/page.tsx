'use client';

import { Button, Center, Container, Paper, Text, ThemeIcon, Title } from '@repo/ui/components/mantine';
import { IconMail, IconMailOpened } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function VerifyRequestPage() {
    const router = useRouter();

    const goToHome = () => {
        router.push('/');
    };

    return (
        <Container size="sm" py="xl">
            <Paper radius="md" p="xl" withBorder shadow="md">
                <Center mb="xl">
                    <ThemeIcon size={80} radius={100} color="green">
                        <IconMailOpened size={40} />
                    </ThemeIcon>
                </Center>

                <Center>
                    <Title order={2} mb="md">Check your inbox</Title>
                </Center>

                <Text ta="center" mt="md" mb="md">
                    A sign in link has been sent to your email address.
                </Text>

                <Text ta="center" mb="xl" c="dimmed" size="sm">
                    If you don&apos;t see it, check your spam folder. The link is only valid for a limited time.
                </Text>

                <Center>
                    <Button onClick={goToHome} variant="light" radius="md" leftSection={<IconMail size={16} />}>
                        Return to Home
                    </Button>
                </Center>
            </Paper>
        </Container>
    );
}