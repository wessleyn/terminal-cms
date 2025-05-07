'use client';
import { Container, Group, Pagination, SimpleGrid, Title } from '@repo/ui/components/mantine';
import { BlogPost } from '../../_actions/getRecentPosts';
import { PostCard } from './PostCard';

interface RecentPostsSectionProps {
  posts: BlogPost[];
}

export function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  return (
    <Container size="xl" style={{ marginBottom: '3rem' }}>
      <Title order={2} mb="xl">Recent Posts</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </SimpleGrid>

      <Group justify="center" mt="xl">
        <Pagination total={10} />
      </Group>
    </Container>
  );
}
