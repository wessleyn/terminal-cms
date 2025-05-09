import { Metadata } from 'next';
import { fetchComments, getCommentStats } from './_actions/fetchComments';
import { CommentsHeader } from './_components/CommentsHeader';
import { CommentsTable } from './_components/CommentsTable';

export const metadata: Metadata = {
  title: 'All Comments - Admin Dashboard',
  description: 'Manage all blog comments',
};

export default async function AllCommentsPage() {
  // Fetch all comments
  const [comments, stats] = await Promise.all([
    fetchComments(),
    getCommentStats(),
  ]);

  return (
    <>
      <CommentsHeader
        total={stats.total}
        pending={stats.pending}
        approved={stats.approved}
        rejected={stats.rejected}
      />
      <CommentsTable comments={comments} emptyMessage="No comments found." />
    </>
  );
}
