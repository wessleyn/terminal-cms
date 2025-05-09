import { Metadata } from 'next';
import { fetchComments, getCommentStats } from '../_actions/fetchComments';
import { CommentsHeader } from '../_components/CommentsHeader';
import { CommentsTable } from '../_components/CommentsTable';

export const metadata: Metadata = {
  title: 'Approved Comments - Admin Dashboard',
  description: 'View and manage approved blog comments',
};

export default async function ApprovedCommentsPage() {
  // Fetch approved comments
  const [comments, stats] = await Promise.all([
    fetchComments('approved'),
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
        emptyMessage="No approved comments found."
      />
    </>
  );
}
