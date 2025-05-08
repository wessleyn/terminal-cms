'use client';

import { Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { PrivacySection } from '@repo/db';
import { format } from 'date-fns';

interface TermsOfServiceContentProps {
    sections: PrivacySection[];
    updatedAt: Date | string;
    descPhrase: string;
    errorMessage?: string;
}

export default function TermsOfServiceContent({
    sections,
    updatedAt,
    descPhrase,
    errorMessage
}: TermsOfServiceContentProps) {
    if (errorMessage) {
        return (
            <Container size="md" py="xl">
                <Paper p="xl" withBorder>
                    <Title order={1}>Terms of Service</Title>
                    <Text mt="lg">{errorMessage}</Text>
                </Paper>
            </Container>
        );
    }

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