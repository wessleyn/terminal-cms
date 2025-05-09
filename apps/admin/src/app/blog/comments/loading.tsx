import { Container } from '@mantine/core';
import { CommentsSkeleton } from './_components/CommentsSkeleton';

export default function CommentsLoading() {
  return (
    <Container fluid>
      <CommentsSkeleton />
    </Container>
  );
}
