'use client';

import { Paper, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import styles from './UsersTable.module.css';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Paper
            shadow="xs"
            radius="md"
            p="md"
            mb="md"
            className={`${styles.searchBarContainer} ${isFocused ? styles.searchBarFocused : ''}`}
        >
            <TextInput
                placeholder="Search users by name, email, or role..."
                value={value}
                onChange={(event) => onChange(event.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                classNames={{
                    root: styles.searchInputRoot,
                    input: styles.searchInput
                }}
            />
        </Paper>
    );
}
