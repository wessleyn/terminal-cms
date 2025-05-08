import React, { ReactElement, ReactNode } from 'react';
import styles from './TableOfContents.module.css';
import { HeadingData } from './useHeadings';

interface TocLinkProps {
    children: ReactNode;
    href?: string;
    activeId: string | null;
    scrollToHeading: (id: string) => void;
    [key: string]: unknown;
}

interface TocItemProps {
    children: ReactNode;
    headings: HeadingData[];
    [key: string]: unknown;
}

/**
 * Custom link component for TOC links with active state styling
 */
export const TocLink = React.memo(({ children, href, activeId, scrollToHeading, ...props }: TocLinkProps) => {
    if (!href || typeof href !== 'string') return <a {...props}>{children}</a>;

    const id = href.replace('#', '');
    const isActive = activeId === id;

    return (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();
                scrollToHeading(id);
            }}
            className={`${styles.tocLink} ${isActive ? styles.active : ''}`}
            aria-current={isActive ? 'location' : undefined}
            data-active={isActive ? 'true' : 'false'}
            style={{
                fontWeight: isActive ? 'bold' : 'normal',
                color: isActive ? 'var(--mantine-color-green-6)' : undefined,
                transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                transition: 'all 0.3s ease-out',
                position: 'relative'
            }}
            {...props}
        >
            {isActive && <span className={styles.activeBullet}>•</span>}
            {children}
        </a>
    );
});

TocLink.displayName = 'TocLink';

/**
 * Custom list item component for TOC items with depth-based styling
 */
export const TocItem = React.memo(({ children, headings, ...props }: TocItemProps) => {
    let depth = 1;

    // Check if children is a React element with props that include href
    if (React.isValidElement(children)) {
        // Type assertion to safely access children's props
        const childElement = children as ReactElement<{ href?: string }>;

        if (childElement.props && childElement.props.href) {
            const id = childElement.props.href.replace('#', '');
            const heading = headings.find(h => h.id === id);
            if (heading) {
                depth = heading.level;
            }
        }
    }

    return (
        <li
            className={`${styles.tocItem} ${styles[`depth${depth}`]}`}
            style={{
                listStyleType: 'none',
                position: 'relative',
                transition: 'all 0.3s ease-out'
            }}
            {...props}
        >
            {children}
        </li>
    );
});

TocItem.displayName = 'TocItem';