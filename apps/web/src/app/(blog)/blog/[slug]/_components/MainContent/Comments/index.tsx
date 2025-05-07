'use client';

import { BlogComment } from '@repo/db';
import { Divider, Stack, Text, Title } from '@repo/ui/components/mantine';
import { IconMessageCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import getCommentsByPostId from '../../../_actions/getCommentsByPostId';
import Comment from './Comment';
import CommentForm from './CommentForm';

interface CommentsProps {
    postId: string;
    slug: string; // Add slug prop
}

export default function Comments({ postId, slug }: CommentsProps) {
    const [comments, setComments] = useState<BlogComment[]>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchComments()
        console.log("Called")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    // Function to refresh comments after a new comment is posted
    const fetchComments = async () => {
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


    if (!comments || isLoading) {
        // comments should be an empty [] 
        return <div>Loading</div>
    }

    const isEmpty = comments.length == 0

    return (
        <Stack gap="xl" mt="xl">
            <Divider />

            <Title order={2} id="comments">
                <IconMessageCircle style={{ marginRight: '0.5rem' }} />
                Comments ({comments.length})
            </Title>

            {
                isEmpty ?
                    <Text c="dimmed" style={{ fontStyle: 'italic' }}>
                        Be the first to leave a comment!
                    </Text>
                    :
                    <Stack gap="md">
                        {comments.map((comment) => (
                            <Comment key={comment.id} comment={comment} postId={postId} slug={slug} />
                        ))}
                    </Stack>
            }

            <Divider />

            <Stack gap="md">
                <Title order={3}>{ isEmpty ? 'Leave a Comment' : 'Join the Discussion'} </Title>
                <CommentForm
                    postId={postId}
                    slug={slug}
                    onSuccess={() => fetchComments()}
                />
            </Stack>
        </Stack>
    );
}