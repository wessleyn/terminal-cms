'use client';

import { Avatar, Button, Group, Stack, Text, Title } from '@repo/ui/components/mantine';
import { IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';

interface BlogAuthorSidebarProps {
    author?: {
        name: string;
        bio?: string;
        avatarUrl?: string | null;
    } | null;
}

export default function BlogAuthorSidebar({ author }: BlogAuthorSidebarProps) {
    if (!author) {
        return null;
    }

    return (
        <div style={{ padding: "1rem" }} className="mb-4">
            <Stack align="center">
                <Avatar
                    src={author.avatarUrl || "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200"}
                    size={100}
                    radius="xl"
                    mb="sm"
                />
                <Title order={4}>{author.name}</Title>
                <Text size="sm" ta="center" c="dimmed" mb="md">
                    {author.bio || "Professional writer and content creator specializing in technology, magic, and digital culture."}
                </Text>
                <Button variant="outline" size="sm" radius="md">
                    Read my bio
                </Button>
                <Group mt="md">
                    <IconBrandFacebook size={20} style={{ cursor: 'pointer' }} />
                    <IconBrandTwitter size={20} style={{ cursor: 'pointer' }} />
                    <IconBrandInstagram size={20} style={{ cursor: 'pointer' }} />
                    <IconBrandYoutube size={20} style={{ cursor: 'pointer' }} />
                </Group>
            </Stack>
        </div>
    );
}
