import { Metadata } from 'next';
import { fetchComments } from './_actions/fetchComments';
import { CommentsTable } from './_components/CommentsTable';

export const metadata: Metadata = {
  title: 'All Comments - Admin Dashboard',
  description: 'Manage all blog comments',
};

export default async function AllCommentsPage() {
  // Fetch all comments - no need to fetch stats since it's in the layout now
  const comments = await fetchComments();

  return <CommentsTable comments={comments} emptyMessage="No comments found." />;
}
