'use client';

import { TextInput } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useSearchRouteHandler, useSearchStore } from '../_stores/searchStore';

export default function GlobalSearch() {
  const { query, isSearchVisible, setQuery, hideSearch, showSearch } = useSearchStore();

  // Handle route changes
  useSearchRouteHandler();

  // Setup keyboard shortcuts for search (Ctrl+K or Cmd+K)
  useHotkeys([
    ['mod+k', (event) => {
      event.preventDefault();
      showSearch();
      setTimeout(() => {
        document.getElementById('global-search')?.focus();
      }, 10);
    }],
    ['escape', () => {
      if (isSearchVisible) hideSearch();
    }],
  ]);

  return (
      <TextInput
        id="global-search"
        placeholder="Search..."
        value={query}
      size='md'
      radius='xl'
        onChange={(event) => setQuery(event.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        rightSection={
          <div className="search-shortcut">
            <span>ESC</span>
          </div>
        }
        classNames={{
          input: 'global-search-input',
          root: 'global-search-root',
        }}
        onBlur={() => {
          if (!query) hideSearch();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') hideSearch();
        }}
        autoFocus
      />
  );
}
