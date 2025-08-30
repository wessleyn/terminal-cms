'use client'
import { useMantineTheme } from '@mantine/core';
import { IconShare } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import EngagementButton from '../EngagementButton';
import styles from './ShareAnimation.module.css';
interface ShareButtonProps {
    initialShared: boolean;
    initialCount: number;
    onShareChange: (newCount: number) => void;
    projectTitle?: string;
    projectUrl?: string;
    projectDescription?: string;
}

const ShareButton = ({
    initialShared = false,
    initialCount = 0,
    onShareChange,
    projectTitle = "Check out this project",
    projectUrl = typeof window !== 'undefined' ? window.location.href : '',
    projectDescription = "I found this awesome project!"
}: ShareButtonProps) => {
    const theme = useMantineTheme();
    const [shared, setShared] = useState(initialShared);
    const [hoverShare, setHoverShare] = useState(false);
    const [shareCount, setShareCount] = useState(initialCount);
    const [showAnimation, setShowAnimation] = useState(false);

    const handleShareAction = async () => {
        //  if Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: projectTitle,
                    text: projectDescription,
                    url: projectUrl
                });

                // Increment share count only on successful share
                const newCount = shareCount + 1;
                setShareCount(newCount);
                onShareChange(newCount);
                setShared(true);

                // Show animation
                setShowAnimation(true);

                // Reset states after animation completes
                setTimeout(() => {
                    setShared(false);
                    setShowAnimation(false);
                }, 1500); // Match animation duration

            } catch {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(`${projectTitle}\n${projectDescription}\n${projectUrl}`);

                // Show alert and wait for it to be closed
                alert("Link copied to clipboard! You can now share it manually.");

                // After alert is closed, show animation and increment count
                setShowAnimation(true);
                setShared(true);

                const newCount = shareCount + 1;
                setShareCount(newCount);
                onShareChange(newCount);

                setTimeout(() => {
                    // setShared(false);
                    setShowAnimation(false);
                }, 1500); // Match animation duration
            } catch {
                alert("Sharing is not supported on this browser. Please copy the URL manually.");
            }
        }
    };

    // Cleanup animation when component unmounts
    useEffect(() => {
        return () => {
            setShowAnimation(false);
        };
    }, []);

    return (
        <>
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

            {showAnimation && (
                <div className={styles.shareAnimationContainer}>
                    <IconShare
                        className={styles.shareAnimation}
                        size={300}
                        color={theme.colors.blue[9]}
                        fill={theme.colors.blue[9]}
                        stroke={4}
                        style={{
                            filter: `drop-shadow(0 0 30px ${theme.colors.blue[9]})`
                        }}
                    />
                    <div className={styles.particles}>
                        <div className={styles.particle} />
                        <div className={styles.particle} />
                        <div className={styles.particle} />
                        <div className={styles.particle} />
                    </div>
                </div>
            )}
        </>
    );
};

export default ShareButton;
