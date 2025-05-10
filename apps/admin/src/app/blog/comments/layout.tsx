import { Container } from '@mantine/core';
import { ReactNode } from 'react';
import { getCommentStats } from './_actions/getCommentStats';
import { CommentsHeader } from './_components/CommentsHeader';

export default async function CommentsLayout({ children }: { children: ReactNode }) {
  // Fetch comment stats once at the layout level
  const stats = await getCommentStats();

  return (
    <Container fluid>
      {/* Comments header with stats moved from individual pages to layout */}
      <CommentsHeader
        total={stats.total}
        pending={stats.pending}
        approved={stats.approved}
        rejected={stats.rejected}
      />
      {children}
    </Container>
  );
}
