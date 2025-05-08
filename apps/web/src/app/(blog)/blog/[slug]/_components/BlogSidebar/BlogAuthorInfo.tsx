'use client';

import { Avatar, Button, Group, Stack, Text, Title } from '@repo/ui/components/mantine';
import { SocialIcon } from '@repo/ui/components/shared';
import Link from 'next/link';
import { AuthorProfile } from '../../_actions/fetchAuthorProfile';

export default function BlogAuthorInfo({ author }: { author: AuthorProfile }) {
    const { name, bio, avatarUrl, socials } = author;

    return (
        <div style={{ padding: "1rem" }} className="mb-4">
            <Stack align="center">
                <Avatar
                    src={avatarUrl}
                    size={100}
                    radius="xl"
                    mb="sm"
                />
                <Title order={4}>{name}</Title>
                <Text size="sm" ta="center" c="dimmed" mb="md">
                    {bio}
                </Text>
                <Button variant="outline" size="sm" radius="md">
                    <Link href='/#bio'>Read my bio</Link>
                </Button>
                <Group mt="md">
                    {socials.map((link, index) => (
                        <Link
                            key={`social-link-${index}`}
                            className="text-reset"
                            href={link.url}
                            target="_blank"
                            rel="noopener"
                            aria-label={`${link.platform} Profile`}
                        >
                            <SocialIcon
                                platform={link.platform}
                                size={20}
                                className="bi fs-5"
                            />
                        </Link>
                    ))}
                </Group>
            </Stack>
        </div>
    );
}
