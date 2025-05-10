import { Metadata } from 'next';
import { fetchComments } from '../_actions/fetchComments';
import { CommentsTable } from '../_components/CommentsTable';

export const metadata: Metadata = {
  title: 'Pending Comments - Admin Dashboard',
  description: 'Review and manage pending blog comments',
};

export default async function PendingCommentsPage() {
  // Just fetch comments - header with stats is in the layout
  const comments = await fetchComments('pending');

  return (
    <CommentsTable
      comments={comments}
      emptyMessage="No pending comments found."
    />
  );
}
