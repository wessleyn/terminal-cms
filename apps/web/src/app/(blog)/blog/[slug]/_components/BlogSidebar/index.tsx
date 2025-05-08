'use client';

import { Stack } from '@repo/ui/components/mantine';
import { AuthorProfile } from '../../_actions/fetchAuthorProfile';
import BlogAuthorInfo from './BlogAuthorInfo';
import styles from './BlogSidebar.module.css';
import TableOfContents from './TableOfContents';

export default function BlogSidebar({ author, content }: { author: AuthorProfile,   content: string }) {

    return (
        <Stack className={styles.sidebarContainer}>
            {/* Author Bio */}
            <BlogAuthorInfo author={author} />

            {/* Table of Contents */}
            <TableOfContents content={content} />
        </Stack>
    );
}
