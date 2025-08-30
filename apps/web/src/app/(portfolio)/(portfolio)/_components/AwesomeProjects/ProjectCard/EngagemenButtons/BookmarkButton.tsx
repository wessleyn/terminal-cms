'use client'
import { useMantineTheme } from '@mantine/core';
import { IconBookmark } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EngagementButton from './EngagementButton';

interface BookmarkButtonProps {
    initialBookmarked?: boolean;
    initialCount: number;
    onBookmarkChange?: (newCount: number) => void;
    projectId?: string;
}

const BookmarkButton = ({
    initialCount = 0,
    projectId = ""
}: BookmarkButtonProps) => {
    const theme = useMantineTheme();
    const router = useRouter();
    const [hoverBookmark, setHoverBookmark] = useState(false);
    const [bookmarkCount] = useState(initialCount);

    const handleBookmarkAction = () => {
        // Navigate to the project page
        if (projectId) {
            router.push(`/projects/${projectId}#bookmark`);
        } else {
            // If no project ID, just show a message (this is a fallback)
            alert("Please visit the project page to bookmark this project.");
        }
    };

    return (
        <EngagementButton
            label="More Details"
            count={bookmarkCount}
            onAction={handleBookmarkAction}
            onMouseEnter={() => setHoverBookmark(true)}
            onMouseLeave={() => setHoverBookmark(false)}
            color="yellow"
            icon={
                <IconBookmark
                    size={40}
                    color={theme.colors.yellow[7]}
                    fill={hoverBookmark ? theme.colors.yellow[7] : 'transparent'}
                    style={{ transition: 'fill 200ms ease' }}
                />
            }
        />
    );
};

export default BookmarkButton;
