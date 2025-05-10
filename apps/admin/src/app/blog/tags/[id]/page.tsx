import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchTagById } from './_actions/fetchTagById';
import TagDetail from './_components/TagDetail';

interface TagPageProps {
    params: Promise<{
        id: string;
    }>
    searchParams: Promise<{
        edit?: string;
    }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const tag = await fetchTagById((await params).id);

    if (!tag) {
        return {
            title: 'Tag Not Found',
        };
    }

    return {
        title: `${tag.name} - Tag Management`,
        description: `Manage ${tag.name} tag`,
    };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
    const tag = await fetchTagById((await params).id);

    if (!tag) {
        notFound();
    }

    const isEditMode = (await searchParams).edit === 'true';

    return <TagDetail tag={tag} initialEditMode={isEditMode} />;
}
