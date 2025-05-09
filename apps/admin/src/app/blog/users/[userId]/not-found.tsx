import { Button, Center, Container, Group, Stack, Text, Title } from "@mantine/core";
import { IconUserOff } from "@tabler/icons-react";
import Link from "next/link";

export default function UserNotFound() {
    return (
        <Container>
            <Center style={{ height: "70vh" }}>
                <Stack gap="md" align="center">
                    <IconUserOff size={80} color="var(--mantine-color-gray-5)" stroke={1} />
                    <Title order={2}>User Not Found</Title>
                    <Text color="dimmed" ta="center" style={{ maxWidth: 500 }}>
                        The user you are looking for does not exist or has been deleted.
                    </Text>
                    <Group>
                        <Button component={Link} href="/blog/users" variant="light">
                            Back to Users
                        </Button>
                    </Group>
                </Stack>
            </Center>
        </Container>
    );
}
