import { useEffect, useState } from 'react';
import type { HeadingData } from './useHeadings';

export function useActiveHeading(headings: HeadingData[]): string | null {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (headings.length === 0) return;

        let ticking = false;

        const findActiveHeading = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const offset = 80; // Offset for earlier detection

                    // Get all heading elements
                    const headingElements = headings
                        .map(heading => ({
                            id: heading.id,
                            element: document.getElementById(heading.id),
                            level: heading.level
                        }))
                        .filter(item => item.element !== null);

                    if (headingElements.length === 0) {
                        return;
                    }

                    // Check for headings visible in the viewport
                    const visibleHeadings = headingElements.filter(
                        ({ element }) => element &&
                            element.getBoundingClientRect().top <= offset &&
                            element.getBoundingClientRect().bottom > 0
                    );

                    if (visibleHeadings.length > 0) {
                        // If multiple headings are visible, prefer the one with the lowest position
                        const sortedVisible = [...visibleHeadings].sort(
                            (a, b) =>
                                (a.element?.getBoundingClientRect().top || 0) -
                                (b.element?.getBoundingClientRect().top || 0)
                        );

                        if (sortedVisible[0]) {
                            setActiveId(sortedVisible[0].id);
                        }
                    } else {
                        // No headings visible in viewport, find the last one that's above viewport
                        const headingsAbove = headingElements.filter(
                            ({ element }) => element && element.getBoundingClientRect().bottom <= 0
                        );

                        if (headingsAbove.length > 0) {
                            const initialHeading = headingsAbove[0];
                            if (!initialHeading) return;

                            const lastHeadingAbove = headingsAbove.reduce((latest, current) => {
                                if (!latest || !latest.element) return current;
                                if (!current || !current.element) return latest;

                                const latestRect = latest.element.getBoundingClientRect();
                                const currentRect = current.element.getBoundingClientRect();

                                return currentRect.bottom > latestRect.bottom ? current : latest;
                            }, initialHeading);

                            if (lastHeadingAbove) {
                                setActiveId(lastHeadingAbove.id);
                            }
                        } else {
                            // We're above all headings, select the first one
                            if (headingElements[0]) {
                                setActiveId(headingElements[0].id);
                            }
                        }
                    }

                    ticking = false;
                });

                ticking = true;
            }
        };

        // Force check when component mounts
        const timeout = setTimeout(findActiveHeading, 500);

        window.addEventListener('scroll', findActiveHeading, { passive: true });
        window.addEventListener('resize', findActiveHeading, { passive: true });

        return () => {
            window.removeEventListener('scroll', findActiveHeading);
            window.removeEventListener('resize', findActiveHeading);
            clearTimeout(timeout);
        };
    }, [headings]);

    return activeId;
}