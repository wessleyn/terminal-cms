import type { HeadingData } from './useHeadings';

/**
 * Generates markdown for table of contents with hierarchical numbering
 */
export function generateTocMarkdown(headings: HeadingData[]): string {
    const counter = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    return headings
        .map((heading) => {
            // Reset lower-level counters when a higher-level heading is encountered
            const level = heading.level;
            for (let i = level + 1; i <= 6; i++) {
                counter[i as keyof typeof counter] = 0;
            }
            counter[level as keyof typeof counter]++;

            // Generate hierarchical numbering based on heading level
            let prefix = "";
            if (level === 2) {
                // Top level heading gets simple number
                prefix = `${counter[2]}.`;
            } else if (level > 2) {
                // Subheadings get hierarchical numbering (e.g. 1.1, 1.2.1)
                prefix = Array.from({ length: level - 1 }, (_, i) => {
                    const idx = i + 2; // Start from level 2
                    return counter[idx as keyof typeof counter];
                }).join('.');
            }

            // The "1." at the beginning tells Markdown to make this a numbered list item
            // We add our custom hierarchical prefix to the link text
            return `${'  '.repeat(level - 2)}1. [${prefix} ${heading.text}](#${heading.id})`;
        })
        .join('\n');
}