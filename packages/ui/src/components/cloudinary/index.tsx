// Export all Cloudinary components and utilities
'use client';

import {
    CldImage,
    CldOgImage,
    CldUploadButton,
    CldUploadWidget,
    getCldImageUrl
} from 'next-cloudinary';

// Re-export everything from next-cloudinary
export {
    CldImage, CldOgImage, CldUploadButton,
    CldUploadWidget,
    getCldImageUrl
};

// Configure default Cloudinary options
export const CLOUDINARY_UPLOAD_PRESET = 'terminal_portfolio';

// Helper function to generate Cloudinary URLs with default transformations
export function getOptimizedImageUrl(
    publicId: string,
    options?: {
        width?: number;
        height?: number;
        crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
        quality?: number;
    }
) {
    return getCldImageUrl({
        src: publicId,
        width: options?.width || 800,
        height: options?.height,
        crop: options?.crop || 'fill',
        quality: options?.quality || 80,
    });
}

// Tech tags specific transformation for skill icons
export function getSkillIconUrl(tag: string) {
    return `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto/https://skillicons.dev/icons?i=${tag}`;
}