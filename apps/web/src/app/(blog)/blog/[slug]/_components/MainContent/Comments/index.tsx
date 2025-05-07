'use client';

import { BlogComment } from '@repo/db';
import { Divider, Stack, Text, Title } from '@repo/ui/components/mantine';
import { IconMessageCircle } from '@tabler/icons-react';
import { useState } from 'react';
import getCommentsByPostId from '../../../_actions/getCommentsByPostId';
import Comment from './Comment';
import CommentForm from './CommentForm';

interface CommentsProps {
    postId: string;
    slug: string; // Add slug prop
    initialComments?: BlogComment[]; // Pre-fetched comments from the server
}

export default function Comments({ postId, slug, initialComments = [] }: CommentsProps) {
    const [comments, setComments] = useState<BlogComment[]>(initialComments);
    const [isLoading, setIsLoading] = useState(false);

    // Function to refresh comments after a new comment is posted
    const refreshComments = async () => {
        setIsLoading(true);
        try {
            const fetchedComments = await getCommentsByPostId(postId);
            setComments(fetchedComments);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentSuccess = () => {
        // Reload comments after successful submission
        refreshComments();
    };

    return (
        <Stack gap="xl" mt="xl">
            <Divider />

            <Title order={2} id="comments">
                <IconMessageCircle style={{ marginRight: '0.5rem' }} />
                Comments ({comments.length})
            </Title>

            {comments.length > 0 ? (
                <Stack gap="md">
                    {comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} postId={postId} slug={slug} />
                    ))}
                </Stack>
            ) : (
                <Text c="dimmed" style={{ fontStyle: 'italic' }}>
                    {isLoading ? 'Loading comments...' : 'Be the first to leave a comment!'}
                </Text>
            )}

            <Divider />

            <Stack gap="md">
                <Title order={3}>Leave a Comment</Title>
                <CommentForm postId={postId} slug={slug} onSuccess={handleCommentSuccess} />
            </Stack>
        </Stack>
    );
}