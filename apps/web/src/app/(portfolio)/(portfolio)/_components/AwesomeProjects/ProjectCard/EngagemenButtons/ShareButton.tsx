'use client'
import { useMantineTheme } from '@mantine/core';
import { IconShare } from '@tabler/icons-react';
import { useState } from 'react';
import EngagementButton from './EngagementButton';

interface ShareButtonProps {
    initialShared: boolean;
    initialCount: number;
    onShareChange: (newCount: number) => void;
}

const ShareButton = ({ initialShared = false, initialCount = 0, onShareChange }: ShareButtonProps) => {
    const theme = useMantineTheme();
    const [shared, setShared] = useState(initialShared);
    const [hoverShare, setHoverShare] = useState(false);
    const [shareCount, setShareCount] = useState(initialCount);

    const handleShareAction = () => {
        const newShared = !shared;
        setShared(newShared);
        const newCount = newShared ? shareCount + 1 : shareCount - 1;
        setShareCount(newCount);
        onShareChange(newCount);
    };

    return (
        <EngagementButton
            label="Share"
            count={shareCount}

            onAction={handleShareAction}
            onMouseEnter={() => setHoverShare(true)}
            onMouseLeave={() => setHoverShare(false)}
            color="blue"
            icon={
                <IconShare
                    size={40}
                    color={theme.colors.blue[6]}
                    fill={shared || hoverShare ? theme.colors.blue[6] : 'transparent'}
                    style={{ transition: 'fill 200ms ease' }}
                />
            }
        />
    );
};

export default ShareButton;
