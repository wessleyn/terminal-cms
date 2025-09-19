import { Metadata } from 'next';
import { fetchAllTags } from './_actions/fetchAllTags';
import TagsPageClient from './_components/TagsPageClient';

export const metadata: Metadata = {
    title: 'Tags Management - Admin Dashboard',
    description: 'Manage blog tags',
};


export default async function TagsPage() {
    // Fetch all tags with post counts
    const tags = await fetchAllTags();

    return (
        <TagsPageClient initialTags={tags} />
    );
}
