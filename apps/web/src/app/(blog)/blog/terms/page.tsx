import { Container, Group, Paper, Stack, Text, Title } from '@repo/ui/components/mantine';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { fetchTermsOfService } from './_actions/fetchTerms';

export const metadata: Metadata = {
    title: 'Terms of Service | Terminal Blog',
    description: 'Terms of Service for Terminal Blog',
};

export default async function BlogTermsOfServicePage() {
    const response = await fetchTermsOfService();

    if (!response.success || !response.data) {
        return (
            <Container size="md" py="xl">
                <Paper p="xl" withBorder>
                    <Title order={1}>Terms of Service</Title>
                    <Text mt="lg">Could not load terms of service. Please try again later.</Text>
                </Paper>
            </Container>
        );
    }

    const { sections, updatedAt, descPhrase } = response.data;

    return (
        <Container size="md" py="xl">
            <Paper p="xl" withBorder>
                <Stack gap="xl">
                    <div>
                        <Title order={1}>Terms of Service</Title>
                        <Group mt="md">
                            <Text size="sm" c="dimmed">Last updated: {format(new Date(updatedAt), 'MMMM dd, yyyy')}</Text>
                        </Group>
                    </div>

                    <Text>{descPhrase}</Text>

                    {sections.map((section) => (
                        <div key={section.id}>
                            <Title order={2} mb="sm">{section.title}</Title>
                            <Text style={{ whiteSpace: 'pre-wrap' }}>{section.content}</Text>
                        </div>
                    ))}
                </Stack>
            </Paper>
        </Container>
    );
}