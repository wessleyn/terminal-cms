'use client'
import {
    ActionIcon,
    Badge,
    Card,
    Center,
    Group,
    Image as MantineImage,
    Text,
    Tooltip,
    useMantineTheme
} from '@mantine/core';

import { Project } from '@repo/db';
import TechTags from '@repo/ui/components/shared/TechTags';
import { IconBookmark, IconHeart, IconShare } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import classes from './ProjectCard.module.css';

// Define type for our engagement data structure
interface EngagementData {
    like?: number;
    bookmark?: number;
    share?: number;
}

const ProjectCard = ({ project }: { project: Project }) => {
    const theme = useMantineTheme();
    const isLive = !!project.liveUrl
    const linkProps = {
        href: project.liveUrl ?? `\\projects\\${project.id}`,
        target: isLive ? '_blank' : ''
    };

    // State for tracking liked, bookmarked, and shared status
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [shared, setShared] = useState(false);

    // State for hover effects
    const [hoverHeart, setHoverHeart] = useState(false);
    const [hoverBookmark, setHoverBookmark] = useState(false);
    const [hoverShare, setHoverShare] = useState(false);

    // Safely parse engagement data
    let engagementData: EngagementData = {};

    try {
        if (project.engagement) {
            // Cast JSON data to our interface
            engagementData = project.engagement as unknown as EngagementData;
        }
    } catch (error) {
        console.error("Error parsing engagement data:", error);
    }

    // Get engagement counts with fallbacks
    const likeCount = engagementData?.like || 0;
    const bookmarkCount = engagementData?.bookmark || 0;
    const shareCount = engagementData?.share || 0;

    // Define larger icon style to override any CSS constraints
    const largeIconStyle = {
        minWidth: '42px',
        minHeight: '42px',
        width: '42px',
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <Card withBorder radius="md" className={classes.card} component="article">
            <Card.Section>
                <Link {...linkProps}>
                    <MantineImage alt={project.title}
                        src={project.imageUrl || 'https://images.unsplash.com/photo-1601758123927-1c2f8b3a4d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'}
                        height={180} />
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

                <Group gap={16} mr={0}> {/* Increased gap from 12 to 16 */}
                    <Tooltip label={liked ? "Unlike" : "Like"} withArrow position="top">
                        <ActionIcon
                            className={`${classes.action} d-flex gap-2`}
                            onClick={() => setLiked(!liked)}
                            onMouseEnter={() => setHoverHeart(true)}
                            onMouseLeave={() => setHoverHeart(false)}
                            size={48}  // Further increased from 40
                            radius="md"
                            variant="light"
                            color="red"
                            style={largeIconStyle}
                        >
                            <IconHeart
                                size={32}  // Further increased from 36
                                color={theme.colors.red[6]}
                                fill={liked || hoverHeart ? theme.colors.red[6] : 'transparent'}
                                style={{ transition: 'fill 200ms ease' }}
                            />
                            <Text size='md'>{likeCount}</Text>
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label={bookmarked ? "Remove bookmark" : "Bookmark"} withArrow position="top">
                        <ActionIcon
                            className={classes.action}
                            onClick={() => setBookmarked(!bookmarked)}
                            onMouseEnter={() => setHoverBookmark(true)}
                            onMouseLeave={() => setHoverBookmark(false)}
                            size={48}  // Further increased from 40
                            radius="md"
                            variant="light"
                            color="yellow"
                            style={largeIconStyle}
                        >
                            <IconBookmark
                                size={40}  // Further increased from 36
                                color={theme.colors.yellow[7]}
                                fill={bookmarked || hoverBookmark ? theme.colors.yellow[7] : 'transparent'}
                                style={{ transition: 'fill 200ms ease' }}
                            />
                            <Text size='md'>{bookmarkCount}</Text>
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Share" withArrow position="top">
                        <ActionIcon
                            className={classes.action}
                            onClick={() => setShared(!shared)}
                            onMouseEnter={() => setHoverShare(true)}
                            onMouseLeave={() => setHoverShare(false)}
                            size={48}  // Further increased from 40
                            radius="md"
                            variant="light"
                            color="blue"
                            style={largeIconStyle}
                        >
                            <IconShare
                                size={40}  // Further increased from 36
                                color={theme.colors.blue[6]}
                                fill={shared || hoverShare ? theme.colors.blue[6] : 'transparent'}
                                style={{ transition: 'fill 200ms ease' }}
                            />
                            <Text size='md'>{shareCount}</Text>
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>
        </Card>
    );
}

export default ProjectCard;