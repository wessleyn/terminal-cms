'use client';

import Markdown from 'markdown-to-jsx';
import { FC, JSXElementConstructor, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  content: string;
}

interface HeadingData {
  id: string;
  text: string;
  level: number;
}

interface TocLinkProps {
  children: ReactNode;
  href?: string;
  [key: string]: unknown;
}

interface TocItemProps {
  children: ReactNode;
  [key: string]: unknown;
}

const TableOfContents: FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tocMarkdown, setTocMarkdown] = useState<string>('');

  // Extract headings from content and create TOC markdown
  useEffect(() => {
    // Extract headings with regex (h2-h6)
    const headingRegex = /^(#{2,6})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];

    const extractedHeadings: HeadingData[] = matches.map((match) => {
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

    setHeadings(extractedHeadings);

    // Create markdown TOC from extracted headings with hierarchical numbering
    const counter = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    const tocContent = extractedHeadings
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

    setTocMarkdown(tocContent);
  }, [content]);

  // Set up intersection observer to track active headings during scroll
  useEffect(() => {
    if (headings.length === 0) return;

    let ticking = false;

    // Move findActiveHeading function declaration before it's used
    const findActiveHeading = () => {
      if (!ticking) {
        // Use requestAnimationFrame for smoother performance
        window.requestAnimationFrame(() => {
          // Use a smaller offset to detect headings sooner
          const offset = 80;

          // Get all heading elements
          const headingElements = headings
            .map(heading => ({
              id: heading.id,
              element: document.getElementById(heading.id),
              level: heading.level // Include level for hierarchy-based decisions
            }))
            .filter(item => item.element !== null);

          if (headingElements.length === 0) {
            console.debug("No heading elements found on page");
            return;
          }

          // Debug which headings are found
          console.debug(`Found ${headingElements.length} heading elements`);

          // Enhanced algorithm: consider both position and hierarchy
          // First check for headings that are visible in the viewport
          const visibleHeadings = headingElements.filter(
            ({ element }) => element &&
              element.getBoundingClientRect().top <= offset &&
              element.getBoundingClientRect().bottom > 0
          );

          if (visibleHeadings.length > 0) {
            // If multiple headings are visible, prefer the one with the lowest position
            // that's still above our offset
            const sortedVisible = [...visibleHeadings].sort(
              (a, b) =>
                (a.element?.getBoundingClientRect().top || 0) -
                (b.element?.getBoundingClientRect().top || 0)
            );

            // Fix: Check if sortedVisible[0] exists before accessing its id
            if (sortedVisible[0]) {
              setActiveId(sortedVisible[0].id);
            }
          } else {
            // No headings visible in viewport, find the last one that's above viewport
            const headingsAbove = headingElements.filter(
              ({ element }) => element && element.getBoundingClientRect().bottom <= 0
            );

            if (headingsAbove.length > 0) {
              // Get the last heading that's above the viewport
              // Fix: Check if headingsAbove[0] exists before using as default
              const initialHeading = headingsAbove[0];
              if (!initialHeading) return;

              const lastHeadingAbove = headingsAbove.reduce((latest, current) => {
                if (!latest || !latest.element) return current;
                if (!current || !current.element) return latest;

                const latestRect = latest.element.getBoundingClientRect();
                const currentRect = current.element.getBoundingClientRect();

                return currentRect.bottom > latestRect.bottom ? current : latest;
              }, initialHeading);

              // Fix: Check if lastHeadingAbove exists before accessing its id
              if (lastHeadingAbove) {
                setActiveId(lastHeadingAbove.id);
              }
            } else {
              // We're above all headings, select the first one
              // Fix: Check if headingElements[0] exists before accessing its id
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

    // Now we can use the function after it's been declared
    const timeout = setTimeout(findActiveHeading, 500);

    // Force check when component mounts
    findActiveHeading();

    window.addEventListener('scroll', findActiveHeading, { passive: true });
    window.addEventListener('resize', findActiveHeading, { passive: true });

    return () => {
      window.removeEventListener('scroll', findActiveHeading);
      window.removeEventListener('resize', findActiveHeading);
      clearTimeout(timeout);
    };
  }, [headings]);

  // Handle clicking on a heading to scroll to it
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  }, []);

  // Custom link component for TOC links - enhance visibility of active link
  const TocLink = useCallback(({ children, href, ...props }: TocLinkProps) => {
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
        data-active={isActive ? 'true' : 'false'} // Extra attribute for stronger CSS targeting
        style={isActive ? {
          fontWeight: 'bold',
          color: 'var(--mantine-color-green-6)',
          transform: 'translateX(4px)',
          transition: 'all 0.2s ease-in-out'
        } : undefined}
        {...props}
      >
        {isActive && <span className={styles.activeBullet}>•</span>}
        {children}
      </a>
    );
  }, [activeId, scrollToHeading]);

  // Custom list item component for TOC items - updated for hierarchical numbering
  const TocItem = useCallback(({ children, ...props }: TocItemProps) => {
    // Find the depth by looking at the href of the child link
    let depth = 1;

    // Type guard to check if children is a React element with props
    const isReactElement = (value: ReactNode):
      value is ReactElement<{ href?: string }, string | JSXElementConstructor<unknown>> => {
      return (
        value !== null &&
        typeof value === 'object' &&
        'props' in value &&
        value.props !== null &&
        typeof value.props === 'object'
      );
    };

    if (isReactElement(children) && children.props.href) {
      const id = children.props.href.replace('#', '');
      const heading = headings.find(h => h.id === id);
      if (heading) {
        depth = heading.level;
      }
    }

    // Use CSS counter-reset and counter-increment for proper nesting
    return (
      <li
        className={`${styles.tocItem} ${styles[`depth${depth}`]}`}
        style={{
          listStyleType: 'none', // Hide the default bullets/numbers
          position: 'relative'   // For custom numbering positioning
        }}
        {...props}
      >
        {children}
      </li>
    );
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.tocContainer} terminal-section mb-4`}>
      <div className={styles.terminalCommand}>
        <span className={styles.terminalPrompt}>$</span> cat table-of-contents.md
      </div>
      <div className={styles.terminalOutput}>
        <h4 className="mb-3">Table of Contents</h4>
        <ol className={styles.tocList}> {/* Changed from ul to ol */}
          <Markdown
            options={{
              overrides: {
                a: TocLink,
                li: TocItem,
                ol: { component: 'ol', props: { className: styles.nestedNumberList } }, // Handle nested lists
                ul: { component: 'ol', props: { className: styles.nestedNumberList } } // Convert all ul to ol
              }
            }}
          >
            {tocMarkdown}
          </Markdown>
        </ol>
      </div>
    </div>
  );
};

export default TableOfContents;