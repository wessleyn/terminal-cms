'use client';

import { Badge, Box, Container, Text, Title, useComputedColorScheme, useMantineTheme } from '@mantine/core';

interface TagHeaderProps {
    tag: string;
    color: string;
    description: string;
}

export default function TagHeader({ tag, color, description }: TagHeaderProps) {
    const theme = useMantineTheme();
    const colorScheme = useComputedColorScheme('dark');
    const isDark = colorScheme === 'dark';

    return (
        <Box py="xl" style={{
            backgroundColor: isDark ? theme.colors.dark[8] : theme.colors.gray[0]
        }}>
            <Container size="xl">
                <Badge size="lg" color={color || "blue"} mb="md">
                    Tags
                </Badge>
                <Title order={1} mb="md">#{tag}</Title>
                <Text size="lg" mb="md" c="dimmed" maw={700}>
                    {description}
                </Text>
            </Container>
        </Box>
    );
}