'use client';

import { Progress, Tooltip } from '@mantine/core';
import classes from './EngagementBar.module.css';

interface EngagementBarProps {
    engagement: {
        share: number;
        bookmark: number;
        like: number;
    } | null;
}

export default function EngagementBar({ engagement }: EngagementBarProps) {
    const share = engagement?.share || 0;
    const bookmark = engagement?.bookmark || 0;
    const like = engagement?.like || 0;

    // Ensure the values sum to 100
    const total = share + bookmark + like;
    const normalizedShare = total > 0 ? Math.round((share / total) * 100) : 0;
    const normalizedBookmark = total > 0 ? Math.round((bookmark / total) * 100) : 0;
    const normalizedLike = total > 0 ? Math.round((like / total) * 100) : 0;

    return (
        <div className={classes.container}>
            <Tooltip
                label={
                    <div>
                        <div>Shares: {normalizedShare}%</div>
                        <div>Bookmarks: {normalizedBookmark}%</div>
                        <div>Likes: {normalizedLike}%</div>
                    </div>
                }
                position="bottom"
                withArrow
                multiline
            >
                <Progress.Root size="md" className={classes.root}>
                    <Progress.Section
                        value={normalizedShare}
                        color="blue"
                        className={classes.section}
                    />
                    <Progress.Section
                        value={normalizedBookmark}
                        color="yellow"
                        className={classes.section}
                    />
                    <Progress.Section
                        value={normalizedLike}
                        color="red"
                        className={classes.section}
                    />
                </Progress.Root>
            </Tooltip>

            <div className={classes.legend}>
                <div className={classes.legendItem}>
                    <span className={classes.shareColor}></span>
                    <span className={classes.label}>Share</span>
                </div>
                <div className={classes.legendItem}>
                    <span className={classes.bookmarkColor}></span>
                    <span className={classes.label}>Bookmark</span>
                </div>
                <div className={classes.legendItem}>
                    <span className={classes.likeColor}></span>
                    <span className={classes.label}>Like</span>
                </div>
            </div>
        </div>
    );
}