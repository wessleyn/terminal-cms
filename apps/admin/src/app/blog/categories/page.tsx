import { Metadata } from 'next';
import { fetchAllCategories } from './_actions/fetchAllCategories';
import CategoriesPageClient from './_components/CategoriesPageClient';

export const metadata: Metadata = {
    title: 'Categories Management - Admin Dashboard',
    description: 'Manage blog categories',
};

export default async function CategoriesPage() {
    // Fetch all categories with post counts
    const categories = await fetchAllCategories();

    return (
        <CategoriesPageClient initialCategories={categories} />
    );
}
