'use client';

import { BlogComment } from '@repo/db';
import { Divider, Skeleton, Stack, Text, Title } from '@repo/ui/components/mantine';
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

    // Organize comments into a threaded structure
    const organizeCommentsIntoThreads = (comments: BlogComment[] | undefined) => {
        if (!comments) return { threadedComments: [], commentCount: 0 };

        const commentMap = new Map();
        const topLevelComments: BlogComment[] = [];
        const totalCommentCount = comments.length;

        // First, create a map of all comments by their ID
        comments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, replies: [] });
        });

        // Then, organize them into a parent-child structure
        comments.forEach(comment => {
            if (comment.parentId) {
                const parentComment = commentMap.get(comment.parentId);
                if (parentComment) {
                    parentComment.replies.push(commentMap.get(comment.id));
                } else {
                    topLevelComments.push(commentMap.get(comment.id));
                }
            } else {
                topLevelComments.push(commentMap.get(comment.id));
            }
        });

        return { threadedComments: topLevelComments, commentCount: totalCommentCount };
    };

    if (!comments || isLoading) {
        // TODO: add skeleton loading
        return <Skeleton height={100} />;
    }

    const { threadedComments, commentCount } = organizeCommentsIntoThreads(comments);
    const isEmpty = commentCount === 0;

    return (
        <Stack gap="xl" mt="xl">
            <Divider />

            <Title order={2} id="comments">
                <IconMessageCircle style={{ marginRight: '0.5rem' }} />
                Comments ({commentCount})
            </Title>

            {
                isEmpty ?
                    <Text c="dimmed" style={{ fontStyle: 'italic' }}>
                        Be the first to leave a comment!
                    </Text>
                    :
                    <Stack gap="md">
                        {threadedComments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                postId={postId}
                                slug={slug}
                                onCommentPosted={fetchComments}
                            />
                        ))}
                    </Stack>
            }

            <Divider />

            <Stack gap="md">
                <Title order={3}>{isEmpty ? 'Leave a Comment' : 'Join the Discussion'} </Title>
                <CommentForm
                    postId={postId}
                    slug={slug}
                    onSuccess={() => fetchComments()}
                />
            </Stack>
        </Stack>
    );
}