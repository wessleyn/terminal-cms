'use client'
import { useMantineTheme } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { useState } from 'react';
import EngagementButton from './EngagementButton';

interface LikeButtonProps {
    initialLiked: boolean;
    initialCount: number;
    onLikeChange: (newCount: number) => void;
}

const LikeButton = ({ initialLiked = false, initialCount = 0, onLikeChange }: LikeButtonProps) => {
    const theme = useMantineTheme();
    const [liked, setLiked] = useState(initialLiked);
    const [hoverHeart, setHoverHeart] = useState(false);
    const [likeCount, setLikeCount] = useState(initialCount);

    const handleLikeAction = () => {
        const newLiked = !liked;
        setLiked(newLiked);
        const newCount = newLiked ? likeCount + 1 : likeCount - 1;
        setLikeCount(newCount);
        onLikeChange(newCount);
    };

    return (
        <EngagementButton
            label={liked ? "Unlike" : "Like"}
            count={likeCount}
            onAction={handleLikeAction}
            onMouseEnter={() => setHoverHeart(true)}
            onMouseLeave={() => setHoverHeart(false)}
            color="red"
            icon={
                <IconHeart
                    color={theme.colors.red[6]}
                    fill={liked || hoverHeart ? theme.colors.red[6] : 'transparent'}
                    style={{ transition: 'fill 200ms ease' }}
                />
            }
        />
    );
};

export default LikeButton;
