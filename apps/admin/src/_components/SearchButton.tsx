'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useSearchStore } from '../_stores/searchStore';

export default function SearchButton() {
  // Use toggleSearch instead of showSearch for toggling functionality
  const toggleSearch = useSearchStore((state) => state.toggleSearch);
  const isSearchVisible = useSearchStore((state) => state.isSearchVisible);

  return (
    <Tooltip label={isSearchVisible ? "Close search" : "Search (Ctrl+K)"} position="bottom">
      <ActionIcon
        onClick={toggleSearch}
        variant={isSearchVisible ? "filled" : "subtle"}
        color={isSearchVisible ? "blue" : "gray"}
        size="lg"
        aria-label="Search"
      >
        <IconSearch size={20} />
      </ActionIcon>
    </Tooltip>
  );
}
