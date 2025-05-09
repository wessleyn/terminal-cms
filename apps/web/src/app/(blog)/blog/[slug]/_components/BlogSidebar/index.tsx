'use client';

import { Stack } from '@mantine/core';
import styles from './BlogSidebar.module.css';
import TableOfContents from './TableOfContents';

export default function BlogSidebar({ children, content }: { children: React.ReactNode, content: string }) {

    return (
        <Stack className={styles.sidebarContainer}>
            {/* Author Bio */}
            {children}

            {/* Table of Contents */}
            <TableOfContents content={content} />
        </Stack>
    );
}
