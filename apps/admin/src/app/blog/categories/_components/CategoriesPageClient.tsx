'use client';

import { Button, Group, Paper } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearchStore } from '../../../../_stores/searchStore';
import { createDefaultCategory } from '../_actions/createDefaultCategory';
import { CategoryWithPostCount } from '../_actions/fetchAllCategories';
import CategoriesList from './CategoriesList';
import classes from './CategoriesPage.module.css';

interface CategoriesPageClientProps {
    initialCategories: CategoryWithPostCount[];
}

export default function CategoriesPageClient({ initialCategories }: CategoriesPageClientProps) {
    const router = useRouter();
    const query = useSearchStore(state => state.query);
    const [debouncedSearch] = useDebouncedValue(query, 300);
    const [filteredCategories, setFilteredCategories] = useState(initialCategories);

    // Apply filters whenever dependencies change
    useEffect(() => {
        let filtered = [...initialCategories];

        // Apply search filter
        if (debouncedSearch) {
            const lowerSearch = debouncedSearch.toLowerCase();
            filtered = filtered.filter(
                category =>
                    category.name.toLowerCase().includes(lowerSearch) ||
                    category.slug.toLowerCase().includes(lowerSearch) ||
                    category.description.toLowerCase().includes(lowerSearch)
            );
        }

        setFilteredCategories(filtered);
    }, [initialCategories, debouncedSearch]);

    // Handler for creating a new category
    const handleCreateNewCategory = async () => {
        try {
            const result = await createDefaultCategory();

            if (result.success && result.id) {
                // Navigate to the new category's detail page in edit mode
                router.push(`/blog/categories/${result.id}?edit=true`);
            } else {
                notifications.show({
                    title: 'Error',
                    message: result.error || 'Failed to create new category',
                    color: 'red',
                });
            }
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred',
                color: 'red',
            });
            console.error('Error creating category:', error);
        }
    };

    return (
        <div className={classes.container}>
            {/* New category button */}
            <Group justify="space-between" align="center" mb="lg">
                <div></div>
                <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={handleCreateNewCategory}
                >
                    New Category
                </Button>
            </Group>

            <Paper radius="md" p={0} className={classes.listContainer}>
                <CategoriesList categories={filteredCategories} />
            </Paper>
        </div>
    );
}
