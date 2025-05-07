'use client';
import { Button, Container, Group, Paper, Text, TextInput, Title } from '@repo/ui/components/mantine';
import { IconMail } from '@tabler/icons-react';

export function NewsletterSection() {
    return (
        <Container size="sm" py="xl" style={{ marginBottom: '3rem' }}>
            <Paper
                withBorder
                shadow="md"
                p={30}
                mt={30}
                radius="md"
            >
                <Title ta="center" order={2}>Subscribe to our newsletter</Title>
                <Text ta="center" c="dimmed" mt="md" mb="xl">
                    Stay updated with our latest articles, tutorials, and insights.
                    We promise not to spam your inbox!
                </Text>

                <Group justify="center">
                    <TextInput
                        placeholder="Your email address"
                        style={{ flexGrow: 1, maxWidth: '300px' }}
                        leftSection={<IconMail size={16} />}
                    />
                    <Button>Subscribe</Button>
                </Group>
            </Paper>
        </Container>
    );
}
