'use client';

import { Button, Group, Paper, SegmentedControl } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { BlogTagType } from '@repo/db';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearchStore } from '../../../../_stores/searchStore';
import { createDefaultTag } from '../_actions/createDefaultTag';
import { TagWithPostCount } from '../_actions/fetchAllTags';
import TagsList from './TagsList/index';
import classes from './TagsPage.module.css';

interface TagsPageClientProps {
  initialTags: TagWithPostCount[];
}

export default function TagsPageClient({ initialTags }: TagsPageClientProps) {
  const router = useRouter();
  const query = useSearchStore(state => state.query); // Use Zustand store for query
  const [activeFilter, setActiveFilter] = useState('all');
  const [debouncedSearch] = useDebouncedValue(query, 300);
  const [filteredTags, setFilteredTags] = useState(initialTags);

  // Apply filters whenever dependencies change
  useEffect(() => {
    let filtered = [...initialTags];

    // Filter by type (public/internal)
    if (activeFilter === 'public') {
      filtered = filtered.filter(tag => tag.type === BlogTagType.BLOG);
    } else if (activeFilter === 'internal') {
      filtered = filtered.filter(tag => tag.type === BlogTagType.INTERNAL);
    }

    // Apply search filter
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        tag =>
          tag.name.toLowerCase().includes(lowerSearch) ||
          tag.slug.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredTags(filtered);
  }, [initialTags, activeFilter, debouncedSearch]);

  // Handler for creating a new tag
  const handleCreateNewTag = async () => {
    try {
      const result = await createDefaultTag();

      if (result.success && result.id) {
        // Navigate to the new tag's detail page in edit mode
        router.push(`/blog/tags/${result.id}?edit=true`);
      } else {
        notifications.show({
          title: 'Error',
          message: result.error || 'Failed to create new tag',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
      console.error('Error creating tag:', error);
    }
  };

  return (
    <div className={classes.container}>
      {/* Filter controls and new tag button in the same row */}
      <Group justify="space-between" align="center" mb="lg">
        <SegmentedControl
          value={activeFilter}
          onChange={setActiveFilter}
          data={[
            { label: 'All Tags', value: 'all' },
            { label: 'Public Tags', value: 'public' },
            { label: 'Internal Tags', value: 'internal' }
          ]}
        />

        <Button
          leftSection={<IconPlus size={16} />}
          onClick={handleCreateNewTag}
        >
          New Tag
        </Button>
      </Group>

      <Paper radius="md" p={0} className={classes.listContainer}>
        <TagsList tags={filteredTags} />
      </Paper>
    </div>
  );
}
