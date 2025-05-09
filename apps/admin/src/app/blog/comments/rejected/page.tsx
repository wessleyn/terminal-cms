import { Metadata } from 'next';
import { fetchComments, getCommentStats } from '../_actions/fetchComments';
import { CommentsHeader } from '../_components/CommentsHeader';
import { CommentsTable } from '../_components/CommentsTable';

export const metadata: Metadata = {
  title: 'Rejected Comments - Admin Dashboard',
  description: 'View and manage rejected blog comments',
};

export default async function RejectedCommentsPage() {
  // Fetch rejected comments
  const [comments, stats] = await Promise.all([
    fetchComments('rejected'),
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
        emptyMessage="No rejected comments found."
      />
    </>
  );
}
