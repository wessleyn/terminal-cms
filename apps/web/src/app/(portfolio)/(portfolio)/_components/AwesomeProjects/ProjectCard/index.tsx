'use client'
import {
    Badge,
    Card,
    Center,
    Group,
    Text
} from '@mantine/core';

import Image from 'next/image';

import { Project } from '@repo/db';
import TechTags from '@repo/ui/components/shared/TechTags';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import engageAwesomeProj, { projectEngagement } from '../../../../_actions/engageAwesomeProj';
import classes from './ProjectCard.module.css';
import ShareButton from './EngagemenButtons/ShareButton';
import LikeButton from './EngagemenButtons/LikeButton';
import BookmarkButton from './EngagemenButtons/BookmarkButton';

// Define type for our project with engagement data
type ProjectWithEngagement = Project & {
    projectEngagement?: projectEngagement
};

const ProjectCard = ({ project }: { project: ProjectWithEngagement }) => {
    const isLive = !!project.liveUrl
    const linkProps = {
        href: project.liveUrl ?? `\\projects\\${project.id}`,
        target: isLive ? '_blank' : ''
    };

    // State for counts
    const [likeCount, setLikeCount] = useState(project.projectEngagement?.likes ?? 0);
    const [bookmarkCount, setBookmarkCount] = useState(project.projectEngagement?.bookmarks ?? 0);
    const [shareCount, setShareCount] = useState(project.projectEngagement?.shares ?? 0);


    useEffect(() => {
        engageAwesomeProj(
            {
                likes: likeCount,
                bookmarks: bookmarkCount,
                shares: shareCount
            },
            project.id
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [likeCount, bookmarkCount, shareCount]);

    return (
        <Card withBorder radius="md" className={classes.card} component="article">
            <Card.Section>
                <Link {...linkProps}>
                    <Image alt={project.title}
                        src={project.imageUrl || 'https://images.unsplash.com/photo-1601758123927-1c2f8b3a4d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'}
                        height={100}
                        width={100}
                        layout="responsive"
                    />
                </Link>
            </Card.Section>

            <Badge className={classes.rating} variant="gradient" gradient={{ from: 'yellow', to: 'red' }}>
                {project.projectType}
            </Badge>

            <Text className={classes.title} fw={500} component="a" {...linkProps}>
                {project.title}
            </Text>

            <Text fz="sm" c="dimmed" lineClamp={4}>
                {project.description}
            </Text>

            <Group justify="space-between" className={classes.footer}>
                <Center className='d-flex gap-2'>
                    <TechTags
                        tags={project.tags}
                        iconSize={24}
                        limit={3}
                    />
                </Center>

                <Group gap={16} mr={0}>
                    <LikeButton
                        initialLiked={false}
                        initialCount={project.projectEngagement?.likes ?? 0}
                        onLikeChange={(newCount) => setLikeCount(newCount)}
                    />

                    <BookmarkButton
                        initialBookmarked={false}
                        initialCount={project.projectEngagement?.bookmarks ?? 0}
                        onBookmarkChange={(newCount) => setBookmarkCount(newCount)}
                    />

                    <ShareButton
                        initialShared={false}
                        initialCount={project.projectEngagement?.shares ?? 0}
                        onShareChange={(newCount) => setShareCount(newCount)}
                    />
                </Group>
            </Group>
        </Card>
    );
}

export default ProjectCard;