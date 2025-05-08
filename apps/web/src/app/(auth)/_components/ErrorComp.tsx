'use client'

import { Button, Center, Container, Group, Paper, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function ErrorComp({ message, title, children }: { message: string, title: string, children: React.ReactNode }) {
    return (
        <Container size="sm" py="xl">
            <Paper radius="md" p="xl" withBorder shadow="md">
                <Center>
                    <Title order={2} mb="md" c="red">{title}</Title>
                </Center>

                <Text ta="center" mt="md" mb="xl" c="dimmed">
                    {message}
                </Text>

                <Group justify="center" gap="md">
                    {children}
                </Group>
            </Paper>
        </Container>
    );
}

export const ErrorActionLink = ({ url, action }: { action: string, url: string }) => {
    return (
        <Link href={url} style={{ textDecoration: 'none' }}>
            <Button variant='light' radius='md' px="xl">
                {action}
            </Button>
        </Link>
    )
}