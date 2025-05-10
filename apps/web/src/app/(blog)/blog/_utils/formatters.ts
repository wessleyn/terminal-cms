/**
 * Format a date into a human-readable string
 */
export function formatPostDate(date: Date | string): string {
    const postDate = date instanceof Date ? date : new Date(date);

    return postDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format a number with proper comma separators
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
}
