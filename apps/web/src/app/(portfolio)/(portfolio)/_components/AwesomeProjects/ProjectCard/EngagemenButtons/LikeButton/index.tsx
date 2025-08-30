'use client'
import { Turnstile } from '@/../../packages/ui/src/components/shared/Turnstile';
import { validateTurnstile } from '@/../../packages/ui/src/utils/captcha';
import { Modal, useMantineTheme } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import EngagementButton from '../EngagementButton';
import classes from './LikeAnimation.module.css';

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
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captchaError, setCaptchaError] = useState<string | null>(null);
    const [showAnimation, setShowAnimation] = useState(false);

    const handleLikeAction = async () => {
        // If already liked, we can unlike without verification
        if (liked) {
            setLiked(false);
            const newCount = likeCount - 1;
            setLikeCount(newCount);
            onLikeChange(newCount);
            return;
        }

        // For liking, we need captcha verification
        if (!captchaToken) {
            setShowCaptcha(true);
            return;
        }

        // Verify captcha token
        const validation = await validateTurnstile(captchaToken);

        if (validation.success) {
            setLiked(true);
            const newCount = likeCount + 1;
            setLikeCount(newCount);
            onLikeChange(newCount);
            setCaptchaError(null);
        } else {
            setCaptchaError(validation.errorMessage || 'Captcha verification failed. Please try again.');
        }
    };

    const processCaptchaVerification = async (token: string): Promise<void> => {
        setCaptchaToken(token);
        const validation = await validateTurnstile(token);

        if (validation.success) {
            setShowCaptcha(false);
            setLiked(true);
            const newCount = likeCount + 1;
            setLikeCount(newCount);
            onLikeChange(newCount);
            setCaptchaError(null);

            // Show the animation
            setShowAnimation(true);

            // Hide the animation after it completes
            setTimeout(() => {
                setShowAnimation(false);
            }, 1500); // Match the animation duration
        } else {
            setCaptchaError(validation.errorMessage || 'Captcha verification failed. Please try again.');
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

            {showAnimation && (
                <div className={classes.heartAnimationContainer}>
                    <IconHeart
                        className={classes.heartAnimation}
                        size={300}
                        color={theme.colors.red[9]}
                        fill={theme.colors.red[9]}
                        stroke={4}
                        style={{
                            filter: `drop-shadow(0 0 30px ${theme.colors.red[9]})`
                        }}
                    />
                </div>
            )}

            <Modal
                opened={showCaptcha}
                onClose={() => setShowCaptcha(false)}
                title="Please verify you're human"
                centered
            >
                {captchaError && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {captchaError}
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                    <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                        onVerify={(token) => processCaptchaVerification(token)}
                        onError={() => setCaptchaError('Captcha verification failed. Please try again.')}
                        onExpire={() => setCaptchaToken(null)}
                        theme="auto"
                    />
                </div>
            </Modal>
        </>
    );
};

export default LikeButton;
