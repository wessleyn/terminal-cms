import { useMemo } from 'react';

export interface HeadingData {
    id: string;
    text: string;
    level: number;
}

export function useHeadings(content: string): HeadingData[] {
    return useMemo(() => {
        // Extract headings with regex (h2-h6)
        const headingRegex = /^(#{2,6})\s+(.+)$/gm;
        const matches = [...content.matchAll(headingRegex)];

        return matches.map((match) => {
            const level = match[1]!.length;
            const text = match[2]!.trim();
            // Create slug for heading ID (simple version)
            const id = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');

            return {
                id,
                text,
                level,
            };
        });
    }, [content]);
}