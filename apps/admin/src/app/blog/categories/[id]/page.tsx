import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchCategoryById } from './_actions/fetchCategoryById';
import CategoryDetail from './_components/CategoryDetail';

interface CategoryPageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const categoryId = (await params).id;
    const category = await fetchCategoryById(categoryId);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${category.name} - Categories Management`,
        description: `Edit details for the ${category.name} category.`,
    };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const categoryId = (await params).id;
    const category = await fetchCategoryById(categoryId);

    if (!category) {
        notFound();
    }

    const isEditMode = (await searchParams).edit === 'true';

    return <CategoryDetail category={category} initialEditMode={isEditMode} />;
}
