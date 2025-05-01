'use server';

/**
 * Trigger revalidation on the public frontend for a specific path
 * This helps ensure content changes in admin are immediately reflected on the public site
 * 
 * @param path The path to revalidate on the public frontend (e.g., '/projects')
 */
export async function triggerPublicRevalidation(path: string) {
    try {
        const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;
        const WEB_PUBLIC_URL = process.env.WEB_PUBLIC_URL;

        if (!REVALIDATION_SECRET || !WEB_PUBLIC_URL) {
            console.warn('Missing REVALIDATION_SECRET or WEB_PUBLIC_URL - cannot revalidate public frontend');
            return;
        }

        // Call the revalidation API on the public frontend
        const revalidateUrl = `${WEB_PUBLIC_URL}/api/revalidate?secret=${REVALIDATION_SECRET}&path=${path}`;
        const response = await fetch(revalidateUrl, { next: { revalidate: 0 } });
        const result = await response.json();

        if (!response.ok) {
            console.warn('Failed to revalidate public frontend:', result);
        } else {
            console.log('Public frontend revalidated successfully:', path);
        }
    } catch (error) {
        console.error('Error triggering public frontend revalidation:', error);
    }
}