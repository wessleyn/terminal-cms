'use client'
import { useMantineTheme } from '@mantine/core';
import { IconBookmark } from '@tabler/icons-react';
import { useState } from 'react';
import EngagementButton from './EngagementButton';

interface BookmarkButtonProps {
    initialBookmarked: boolean;
    initialCount: number;
    onBookmarkChange: (newCount: number) => void;
}

const BookmarkButton = ({ initialBookmarked = false, initialCount = 0, onBookmarkChange }: BookmarkButtonProps) => {
    const theme = useMantineTheme();
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const [hoverBookmark, setHoverBookmark] = useState(false);
    const [bookmarkCount, setBookmarkCount] = useState(initialCount);

    const handleBookmarkAction = () => {
        const newBookmarked = !bookmarked;
        setBookmarked(newBookmarked);
        const newCount = newBookmarked ? bookmarkCount + 1 : bookmarkCount - 1;
        setBookmarkCount(newCount);
        onBookmarkChange(newCount);
    };

    return (
        <EngagementButton
            label={bookmarked ? "Remove bookmark" : "Bookmark"}
            count={bookmarkCount}
            onAction={handleBookmarkAction}
            onMouseEnter={() => setHoverBookmark(true)}
            onMouseLeave={() => setHoverBookmark(false)}
            color="yellow"
            icon={
                <IconBookmark
                    size={40}
                    color={theme.colors.yellow[7]}
                    fill={bookmarked || hoverBookmark ? theme.colors.yellow[7] : 'transparent'}
                    style={{ transition: 'fill 200ms ease' }}
                />
            }
        />
    );
};

export default BookmarkButton;
