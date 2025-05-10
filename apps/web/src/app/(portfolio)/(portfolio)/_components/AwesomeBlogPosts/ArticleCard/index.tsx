'use client';

import { Card, Group, Text } from '@mantine/core';
import { AwesomePost } from '../../../../_actions/fetchAwesomePost';
import classes from './ArticleCard.module.css';

interface ArticleCardProps {
    post: AwesomePost;
}

const ArticleCard = ({ post }: ArticleCardProps) => {
    // Format the date for display
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <Card
            p="lg"
            shadow="lg"
            className={classes.card}
            radius="md"
            component="a"
            href={`/blog/${post.slug}`}
            target="_blank"
        >
            <div
                className={classes.image}
                style={{
                    backgroundImage: `url(${post.coverImage || 'https://media.istockphoto.com/id/2176122055/photo/software-development-concept-hands-typing-on-laptop-with-programming-code-on-screen.jpg?s=612x612&w=is&k=20&c=9jVJ1ORAgY_oGw-d70KmyKES5MQc0JutBTXHZUMqMeQ='})`,
                }}
            />
            <div className={classes.overlay} />

            <div className={classes.content}>
                <div>
                    <Text size="lg" className={classes.title} fw={500}>
                        {post.title}
                    </Text>

                    <Group justify="space-between" gap="xs">
                        <Text size="sm" className={classes.author}>
                            {formattedDate} • {post.readTime || '5 min read'}
                        </Text>

                        <Group gap="lg">
                            {post.tags && post.tags.length > 0 && post.tags[0] && (
                                <Text
                                    size="xs"
                                    className={classes.bodyText}
                                    style={{
                                        backgroundColor: post.tags[0].color || 'blue',
                                        padding: '2px 8px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {post.tags[0].name}
                                </Text>
                            )}
                        </Group>
                    </Group>
                </div>
            </div>
        </Card>
    );
}

export default ArticleCard;