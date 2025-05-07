import { unstable_noStore as noStore } from 'next/cache';
import getCommentsByPostId from '../../../_actions/getCommentsByPostId';
import Comments from './index';

interface DynamicCommentsProps {
    postId: string;
    slug: string;
}

// This component uses server-side logic to fetch fresh comments
// on every request, making it dynamic even in a static page
export default async function DynamicComments({ postId, slug }: DynamicCommentsProps) {
    // Opt out of caching for this component
    noStore();

    // Fetch latest comments
    const latestComments = await getCommentsByPostId(postId);

    return (
        <Comments
            postId={postId}
            slug={slug}
            initialComments={latestComments}
        />
    );
}