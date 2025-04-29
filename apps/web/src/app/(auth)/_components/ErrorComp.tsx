'use client'

import { Button, Center, Container, Paper, Text, Title } from '@repo/ui/components/mantine';
import Link from 'next/link';


export default function ErrorComp({ message, title,  children }: { message: string, title: string,  children: React.ReactNode }) {

    return (
        <Container size="sm" py="xl">
            <Paper radius="md" p="xl" withBorder shadow="md">
                <Center>
                    <Title order={2} mb="md" c="red">{title}</Title>
                </Center>

                <Text ta="center" mt="md" mb="xl" c="dimmed">
                    {message}
                </Text>

                <Center>
                    {children}
                </Center>
            </Paper>
        </Container>
    );
}


export const ErrorActionLink = ({ url, action }: { action: string, url: string }) => {
    return (
        <Link href={url} >
            <Button variant='light' radius={'md'}>
                {action}
            </Button>
        </Link>
    )
} 