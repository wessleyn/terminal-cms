'use client';

import { Box, Container, Text, Title } from '@repo/ui/components/mantine';

interface CategoryHeaderProps {
    category: string;
    description: string;
}

export default function CategoryHeader({ category, description }: CategoryHeaderProps) {
    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'spells': return 'blue';
            case 'potions': return 'green';
            case 'scrolls': return 'orange';
            case 'artifacts': return 'violet';
            default: return 'gray';
        }
    };

    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    return (
        <Box py="xl">
            <Container size="xl">
                <Box>
                    <Text size="sm" mb="xs" c={getCategoryColor(category)}>Category</Text>
                    <Title order={1} mb="md">{formattedCategory}</Title>
                    <Text size="lg" maw={600}>{description}</Text>
                </Box>
            </Container>
        </Box>
    );
}
