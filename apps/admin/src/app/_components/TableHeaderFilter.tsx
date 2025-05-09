'use client';

import { ActionIcon, Checkbox, Menu, Text } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { useState } from 'react';

interface TableHeaderFilterProps<T> {
    title: string;
    options: { value: T; label: string }[];
    activeFilters: T[];
    onChange: (values: T[]) => void;
}

export function TableHeaderFilter<T extends string | number>({
    title,
    options,
    activeFilters,
    onChange,
}: TableHeaderFilterProps<T>) {
    const [opened, setOpened] = useState(false);

    const handleCheckboxChange = (value: T) => {
        if (activeFilters.includes(value)) {
            onChange(activeFilters.filter((item) => item !== value));
        } else {
            onChange([...activeFilters, value]);
        }
    };

    const clearFilters = () => {
        onChange([]);
    };

    const isActive = activeFilters.length > 0;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Text fw={600}>{title}</Text>
            <Menu
                position="bottom-start"
                shadow="md"
                width={200}
                closeOnItemClick={false}
                opened={opened}
                onChange={setOpened}
            >
                <Menu.Target>
                    <ActionIcon
                        variant={isActive ? "light" : "subtle"}
                        color={isActive ? "blue" : "gray"}
                        size="sm"
                    >
                        <IconFilter size={16} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Filter by {title.toLowerCase()}</Menu.Label>
                    {options.map((option) => (
                        <Menu.Item
                            key={String(option.value)}
                            py={4}
                            closeMenuOnClick={false}
                        >
                            <Checkbox
                                checked={activeFilters.includes(option.value)}
                                onChange={() => handleCheckboxChange(option.value)}
                                label={option.label}
                                size="sm"
                            />
                        </Menu.Item>
                    ))}
                    <Menu.Divider />
                    <Menu.Item color="blue" onClick={clearFilters} disabled={!isActive}>
                        Clear filters
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}
