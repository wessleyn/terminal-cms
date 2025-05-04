'use client';

import {
    IconBrandBehance,
    IconBrandCodepen,
    IconBrandDiscord,
    IconBrandDribbble,
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandGitlab,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandMedium,
    IconBrandPatreon,
    IconBrandProducthunt,
    IconBrandReddit,
    IconBrandStackoverflow,
    IconBrandTwitch,
    IconBrandTwitter,
    IconBrandX,
    IconBrandYoutube,
    IconCode,
    IconWorld
} from '@tabler/icons-react';
import { normalizePlatformName } from '../../../utils/socialPlatform';

export interface SocialIconProps {
    platform: string;
    size?: number;
    color?: string;
    className?: string;
}

export function SocialIcon({
    platform,
    size = 18,
    color,
    className = ''
}: SocialIconProps) {
    // Normalize platform name
    const normalizedPlatform = normalizePlatformName(platform);
    // Return appropriate icon based on platform
    switch (normalizedPlatform) {
        case 'github':
            return <IconBrandGithub size={size} color={color} className={className} />;
        case 'linkedin':
            return <IconBrandLinkedin size={size} color={color} className={className} />;
        case 'twitter':
            return <IconBrandTwitter size={size} color={color} className={className} />;
        case 'facebook':
            return <IconBrandFacebook size={size} color={color} className={className} />;
        case 'instagram':
            return <IconBrandInstagram size={size} color={color} className={className} />;
        case 'youtube':
            return <IconBrandYoutube size={size} color={color} className={className} />;
        case 'twitch':
            return <IconBrandTwitch size={size} color={color} className={className} />;
        case 'medium':
            return <IconBrandMedium size={size} color={color} className={className} />;
        case 'dribbble':
            return <IconBrandDribbble size={size} color={color} className={className} />;
        case 'behance':
            return <IconBrandBehance size={size} color={color} className={className} />;
        case 'producthunt':
            return <IconBrandProducthunt size={size} color={color} className={className} />;
        case 'stackoverflow':
            return <IconBrandStackoverflow size={size} color={color} className={className} />;
        case 'codepen':
            return <IconBrandCodepen size={size} color={color} className={className} />;
        case 'discord':
            return <IconBrandDiscord size={size} color={color} className={className} />;
        case 'gitlab':
            return <IconBrandGitlab size={size} color={color} className={className} />;
        case 'hashnode':
        case 'dev':
        case 'mastodon':
        case 'bitbucket':
            return <IconCode size={size} color={color} className={className} />;
        case 'reddit':
            return <IconBrandReddit size={size} color={color} className={className} />;
        case 'patreon':
            return <IconBrandPatreon size={size} color={color} className={className} />;
        case 'x':
            return <IconBrandX size={size} color={color} className={className} />;
        default:
            return <IconWorld size={size} color={color} className={className} />;
    }
}

export default SocialIcon;