import { Metadata } from 'next';
import { fetchComments } from '../_actions/fetchComments';
import { CommentsTable } from '../_components/CommentsTable';

export const metadata: Metadata = {
  title: 'Approved Comments - Admin Dashboard',
  description: 'View and manage approved blog comments',
};

export default async function ApprovedCommentsPage() {
  // Just fetch comments - header with stats is in the layout
  const comments = await fetchComments('approved');

  return (
    <CommentsTable
      comments={comments}
      emptyMessage="No approved comments found."
    />
  );
}
