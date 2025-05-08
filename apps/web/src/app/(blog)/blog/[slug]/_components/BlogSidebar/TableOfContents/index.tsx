'use client';

import Markdown from 'markdown-to-jsx';
import { FC, useCallback, useState } from 'react';
import { generateTocMarkdown } from './generateTocMarkdown';
import styles from './TableOfContents.module.css';
import { TocItem, TocLink } from './TocComponents';
import { useActiveHeading } from './useActiveHeading';
import { useHeadings } from './useHeadings';

interface TableOfContentsProps {
  content: string;
}

const TableOfContents: FC<TableOfContentsProps> = ({ content }) => {
  // Use our extracted hooks to get headings and track the active one
  const headings = useHeadings(content);
  const computedActiveId = useActiveHeading(headings);

  // Track manually clicked heading to prevent bouncing
  const [clickedId, setClickedId] = useState<string | null>(null);

  // Use clicked ID if available, otherwise use computed active ID
  const activeId = clickedId || computedActiveId;

  // Generate TOC markdown using our utility function
  const tocMarkdown = generateTocMarkdown(headings);

  // Handle scrolling to a heading when clicked
  const scrollToHeading = useCallback((id: string) => {
    // Set the clicked ID to prevent bouncing
    setClickedId(id);

    // Clear clicked ID after scroll completes (after 1 second)
    // This allows natural scroll tracking to take over again
    setTimeout(() => setClickedId(null), 1000);

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

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
        <ol className={styles.tocList}>
          <Markdown
            options={{
              overrides: {
                a: { component: (props) => <TocLink {...props} activeId={activeId} scrollToHeading={scrollToHeading} /> },
                li: { component: (props) => <TocItem {...props} headings={headings} /> },
                ol: { component: 'ol', props: { className: styles.nestedNumberList } },
                ul: { component: 'ol', props: { className: styles.nestedNumberList } }
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