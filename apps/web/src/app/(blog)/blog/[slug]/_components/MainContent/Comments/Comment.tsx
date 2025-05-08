'use client';

import { Avatar, Button, Group, Paper, Stack, Text } from '@repo/ui/components/mantine';
import { IconCalendar, IconMessageCircle2 } from '@tabler/icons-react';
import { useState } from 'react';
import CommentForm from './CommentForm';

interface CommentProps {
    comment: {
        id: string;
        content: string;
        authorName: string;
        authorEmail: string;
        authorProfile: string
        authorWebsite?: string | null;
        createdAt: Date;
        replies?: CommentProps['comment'][];
    };
    postId: string;
    slug: string; // Add slug prop
    onCommentPosted?: () => void; // Add callback for when a comment is posted
}

export default function Comment({ comment, postId, slug, onCommentPosted }: CommentProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(new Date(date));
    };

    const handleReplySuccess = () => {
        setShowReplyForm(false);
        // Call the onCommentPosted callback to refresh all comments
        if (onCommentPosted) {
            onCommentPosted();
        }
    };

    // Generate avatar from author name

    return (
        <Paper p="md" mb="md" radius="md" bg="transparent">
            <Stack gap="md">
                <Group justify="space-between" align="start" wrap="nowrap">
                    <Group align="start" wrap="nowrap">
                        <Avatar src={comment.authorProfile} alt={comment.authorName} radius="xl" size="md" />
                        <Stack gap="xs">
                            <div>
                                <Text fw={600}>{comment.authorName}</Text>
                                {comment.authorWebsite && (
                                    <Text component="a" href={comment.authorWebsite} fz="xs" c="dimmed" target="_blank" rel="noopener noreferrer">
                                        {new URL(comment.authorWebsite).hostname}
                                    </Text>
                                )}
                            </div>
                            <Group gap="xs">
                                <IconCalendar size={14} />
                                <Text fz="xs" c="dimmed">
                                    {formatDate(comment.createdAt)}
                                </Text>
                            </Group>
                        </Stack>
                    </Group>

                    <Button
                        size="xs"
                        variant="subtle"
                        leftSection={<IconMessageCircle2 size={14} />}
                        onClick={() => setShowReplyForm(!showReplyForm)}
                    >
                        Reply
                    </Button>
                </Group>

                <Text>{comment.content}</Text>

                {showReplyForm && (
                    <div style={{ marginLeft: 20, marginTop: 10 }}>
                        <CommentForm postId={postId} slug={slug} parentId={comment.id} onSuccess={handleReplySuccess} />
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <Stack gap="md" style={{ marginLeft: 20, marginTop: 10 }}>
                        {comment.replies.map((reply) => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                slug={slug}
                                onCommentPosted={onCommentPosted}
                            />
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}