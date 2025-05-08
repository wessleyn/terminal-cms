'use client';
import { Container, Group, Pagination, SimpleGrid, Title } from '@repo/ui/components/mantine';
import { useState } from 'react';
import { BlogPost } from '../../_actions/getRecentPosts';
import { PostCard } from './PostCard';

interface RecentPostsSectionProps {
  posts: BlogPost[];
}

export function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  const [activePage, setActivePage] = useState(1);
  const postsPerPage = 3;

  // Calculate the total number of pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Get the current page of posts
  const currentPosts = posts.slice(
    (activePage - 1) * postsPerPage,
    activePage * postsPerPage
  );

  return (
    <Container size="xl" style={{ marginBottom: '3rem' }} id="recent">
      <Title order={2} mb="xl">Recent Posts</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {currentPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </SimpleGrid>

      <Group justify="center" mt="xl">
        <Pagination
          total={totalPages}
          value={activePage}
          onChange={setActivePage}
        />
      </Group>
    </Container>
  );
}
