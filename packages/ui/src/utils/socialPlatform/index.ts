/**
 * Social platform detector and icon utility
 * Provides functions to identify platforms from URLs and render appropriate icons
 */

// Platform identification patterns
const PLATFORM_PATTERNS = {
    github: [/github\.com/i, /gh\.io/i],
    linkedin: [/linkedin\.com/i, /lnkd\.in/i],
    twitter: [/twitter\.com/i, /x\.com/i],
    facebook: [/facebook\.com/i, /fb\.com/i, /fb\.me/i],
    instagram: [/instagram\.com/i, /instagr\.am/i],
    youtube: [/youtube\.com/i, /youtu\.be/i],
    twitch: [/twitch\.tv/i],
    medium: [/medium\.com/i],
    dribbble: [/dribbble\.com/i],
    behance: [/behance\.net/i],
    producthunt: [/producthunt\.com/i],
    stackoverflow: [/stackoverflow\.com/i],
    codepen: [/codepen\.io/i],
    discord: [/discord\.gg/i, /discord\.com/i],
    gitlab: [/gitlab\.com/i],
    bitbucket: [/bitbucket\.org/i],
    hashnode: [/hashnode\.dev/i, /hashnode\.com/i],
    dev: [/dev\.to/i],
    mastodon: [/mastodon\./i],
    reddit: [/reddit\.com/i],
    patreon: [/patreon\.com/i],
    substack: [/substack\.com/i],
    x: [/x\.com/i],
} as const;

export type SocialPlatform = keyof typeof PLATFORM_PATTERNS | 'other';

/**
 * Detect social platform from URL
 * @param url - URL string to analyze
 * @returns Detected platform name or 'other' if unknown
 */
export function detectPlatform(url: string): SocialPlatform {
    // Handle empty or invalid URLs
    if (!url || typeof url !== 'string') return 'other';

    // Check if the URL matches any known platform pattern
    for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
        if (patterns.some(pattern => pattern.test(url))) {
            return platform as SocialPlatform;
        }
    }

    // Check if the platform name is directly in the URL (without full domain)
    // e.g., "twitter" in custom input
    for (const platform of Object.keys(PLATFORM_PATTERNS)) {
        if (url.toLowerCase().includes(platform.toLowerCase())) {
            return platform as SocialPlatform;
        }
    }

    return 'other';
}

/**
 * Clean and normalize platform name
 * @param platform - Raw platform name or identifier
 * @returns Normalized platform name
 */
export function normalizePlatformName(platform: string): SocialPlatform {
    const normalized = platform.toLowerCase().trim();

    // Check if it's already a known platform
    if (Object.keys(PLATFORM_PATTERNS).includes(normalized)) {
        return normalized as SocialPlatform;
    }

    // Handle common aliases
    if (['tweet', 'tw'].includes(normalized)) return 'twitter';
    if (['gh', 'git'].includes(normalized)) return 'github';
    if (['li', 'in', 'linked'].includes(normalized)) return 'linkedin';
    if (['ig', 'insta'].includes(normalized)) return 'instagram';
    if (['fb', 'face'].includes(normalized)) return 'facebook';
    // Enhanced YouTube detection with more variants
    if (['yt', 'you tube', 'you-tube', 'youtub', 'u tube', 'utube'].includes(normalized) ||
        normalized.includes('youtube') || normalized.includes('you tube')) return 'youtube';

    return 'other';
}

/**
 * Extracts a username from a social media URL
 * @param url - Social media URL
 * @param platform - Platform to extract username for
 * @returns Username if found, empty string otherwise
 */
export function extractUsername(url: string, platform: SocialPlatform): string {
    if (!url) return '';

    try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);

        switch (platform) {
            case 'github':
            case 'twitter':
            case 'instagram':
                return pathParts[0] || '';
            case 'linkedin':
                return pathParts[1] === 'in' ? pathParts[2] || '' : '';
            case 'facebook':
                return pathParts[0] || '';
            default:
                return '';
        }
    } catch (e) {
        // If URL parsing fails, just return empty string
        return '';
    }
}

export default {
    detectPlatform,
    normalizePlatformName,
    extractUsername,
};