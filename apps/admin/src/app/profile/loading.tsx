import { Box, Card, Container, Divider, Skeleton, Stack } from "@mantine/core";

export default function ProfileLoading() {
    return (
        <Container size="md" py="xl">
            <Stack gap="lg">
                {/* Avatar uploader skeleton */}
                <Box mx="auto" style={{ width: '100%', maxWidth: '900px' }}>
                    <Skeleton height={180} radius="md" mb="md" />
                    <Skeleton height={30} width={120} radius="sm" mx="auto" mb="md" />
                </Box>

                {/* Profile information card skeleton */}
                <Card radius="md" withBorder padding="xl" mx="auto" style={{ width: '100%', maxWidth: '900px' }}>
                    {/* Display name section */}
                    <Skeleton height={40} width="70%" radius="sm" mb="xl" />

                    {/* Tagline */}
                    <Skeleton height={30} width="85%" radius="sm" mb="xl" />

                    {/* Description */}
                    <Skeleton height={120} radius="sm" mb="xl" />

                    <Divider my="md" />

                    {/* Social links section */}
                    <Skeleton height={24} width="50%" radius="sm" mb="lg" />

                    {/* Link items */}
                    <Stack gap="md" mb="xl">
                        <Skeleton height={50} radius="sm" />
                        <Skeleton height={50} radius="sm" />
                        <Skeleton height={50} radius="sm" />
                    </Stack>

                    {/* Last saved indicator */}
                    <Skeleton height={20} width={140} radius="sm" mt={24} ml="auto" />
                </Card>
            </Stack>
        </Container>
    );
}