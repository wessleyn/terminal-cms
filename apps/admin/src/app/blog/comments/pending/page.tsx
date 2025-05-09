import { Metadata } from 'next';
import { fetchComments, getCommentStats } from '../_actions/fetchComments';
import { CommentsHeader } from '../_components/CommentsHeader';
import { CommentsTable } from '../_components/CommentsTable';

export const metadata: Metadata = {
  title: 'Pending Comments - Admin Dashboard',
  description: 'Review and manage pending blog comments',
};

export default async function PendingCommentsPage() {
  // Fetch pending comments
  const [comments, stats] = await Promise.all([
    fetchComments('pending'),
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
      <CommentsTable
        comments={comments}
        emptyMessage="No pending comments found."
      />
    </>
  );
}
