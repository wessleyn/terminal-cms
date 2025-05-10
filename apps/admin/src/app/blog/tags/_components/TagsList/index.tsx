'use client';

import { ActionIcon, Badge, Card, Group, SimpleGrid, Text, Tooltip } from '@mantine/core';
import { IconEdit, IconEye, IconLayoutList } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';
import { TagWithPostCount } from '../../_actions/fetchAllTags';
import classes from './TagsList.module.css';
const webPublicUrl = process.env.WEB_PUBLIC_URL || 'https://localhost:3000';

interface TagsListProps {
  tags: TagWithPostCount[];
}

export default function TagsList({ tags }: TagsListProps) {
  const router = useRouter();
  // Get the web public URL from environment variables

  if (tags.length === 0) {
    return (
      <Card p="xl" withBorder radius="md" className={classes.emptyState}>
        <Text c="dimmed" ta="center">No tags found</Text>
      </Card>
    );
  }

  // Handle click on the card to navigate to details page
  const handleCardClick = (tagId: string) => () => {
    router.push(`/blog/tags/${tagId}`);
  };

  // Prevent propagation for links and actions inside the card
  const handleActionClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      spacing="md"
      className={classes.tagsGrid}
    >
      {tags.map((tag) => (
        <Card
          key={tag.id}
          radius="md"
          withBorder
          className={classes.tagCard}
          onClick={handleCardClick(tag.id)}
        >
          <Card.Section className={classes.tagCardHeader} p="md">
            <Group justify="space-between">
              <Group gap="sm">
                <Badge
                  color={tag.color}
                  variant="filled"
                  size="sm"
                  className={classes.colorBadge}
                />
                <Text fw={500}>{tag.name}</Text>
              </Group>

              <Tooltip label="Edit tag" withArrow position="left">
                <ActionIcon
                  component={Link}
                  href={`/blog/tags/${tag.id}?edit=true`}
                  variant="light"
                  radius="xl"
                  className={classes.actionIcon}
                  onClick={handleActionClick}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Card.Section>

          <Card.Section p="md">
            <Text size="xs" c="dimmed" className={classes.tagDescription} mb="md">
              {tag.description || `Tag used for categorizing ${tag.type === 'BLOG' ? 'public' : 'internal'} content`}
            </Text>

            <Group justify="space-between" mt="md">
              {tag.type === 'BLOG' ? (
                <Tooltip label="View in blog" withArrow>
                  <Link
                    href={`${webPublicUrl}/blog/tag/${tag.slug}`}
                    target="_blank"
                    className={classes.tagLink}
                    onClick={handleActionClick}
                  >
                    <Group gap="xs" className={classes.linkGroup}>
                      <Text size="sm" c="dimmed">{tag.slug}</Text>
                      <IconEye size={14} className={classes.icon} />
                    </Group>
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip label="Internal tags are not visible in the public blog">
                  <div className={classes.tagLink} style={{ opacity: 0.6 }}>
                    <Group gap="xs" className={classes.linkGroup}>
                      <Text size="sm" c="dimmed" style={{ textDecoration: 'line-through' }}>{tag.slug}</Text>
                      <IconEye size={14} className={classes.icon} style={{ opacity: 0.5 }} />
                    </Group>
                  </div>
                </Tooltip>
              )}

              <Tooltip label="Browse related posts" withArrow>
                <Link
                  href={`/blog/posts?tag=${tag.slug}`}
                  className={classes.tagLink}
                  onClick={handleActionClick}
                >
                  <Group gap="xs" className={classes.linkGroup}>
                    <Text size="sm">{tag.postCount} posts</Text>
                    <IconLayoutList size={14} className={classes.icon} />
                  </Group>
                </Link>
              </Tooltip>
            </Group>
          </Card.Section>
        </Card>
      ))}
    </SimpleGrid>
  );
}
