import { Card, Container, Group, Skeleton, Stack } from "@mantine/core";

export default function PrivacyLoading() {
    return (
        <Container size="lg" py="xl">
            {/* Title and last updated */}
            <Skeleton height={38} width="40%" mb="lg" />
            <Skeleton height={24} width="25%" mb="lg" />

            {/* Description Editor Card */}
            <Card withBorder p="md" radius="md" mb="xl">
                <Skeleton height={20} width="20%" mb="md" />
                <Skeleton height={80} mb="md" />
                <Group justify="flex-end">
                    <Skeleton height={36} width={120} />
                </Group>
            </Card>

            {/* Draggable Privacy Sections */}
            <Stack gap="md">
                {/* Add new section button */}
                <Group justify="flex-end" mb="md">
                    <Skeleton height={36} width={150} />
                </Group>

                {/* Privacy section cards */}
                {[1, 2, 3].map((_, index) => (
                    <Card key={index} withBorder p="md" radius="md">
                        <Skeleton height={20} width="20%" mb="sm" />
                        <Skeleton height={28} mb="md" />
                        <Skeleton height={20} width="15%" mb="sm" />
                        <Skeleton height={120} mb="md" />
                        <Group justify="flex-end" mt="md">
                            <Skeleton height={36} width={100} />
                            <Skeleton height={36} width={100} />
                        </Group>
                    </Card>
                ))}
            </Stack>
        </Container>
    );
}