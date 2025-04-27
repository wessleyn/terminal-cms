'use client';

import { Button, Flex, TextInput, Title } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useEffect } from 'react';
import classes from './ProjectsHeader.module.css';

interface ProjectsHeaderProps {
    onSearch?: (query: string) => void;
}

export default function ProjectsHeader({ onSearch }: ProjectsHeaderProps) {
    const [searchQuery, setSearchQuery] = useInputState('');

    useEffect(() => {
        // Create a debounce effect manually since we're using Mantine's hooks
        const timeoutId = setTimeout(() => {
            if (onSearch) {
                onSearch(searchQuery);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, onSearch]);

    const handleCreateProject = () => {
        // Modal or navigation logic goes here
        console.log('Create new project clicked');
    };

    return (
        <div className={classes.header}>
            <Title order={2} className={classes.title}>Projects</Title>
            <Flex gap="md" className={classes.controls}>
                <TextInput
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    leftSection={<IconSearch size={16} />}
                    className={classes.search}
                />
                <Button
                    leftSection={<IconPlus size={16} />}
                    variant="filled"
                    onClick={handleCreateProject}
                    className={classes.createButton}
                >
                    New Project
                </Button>
            </Flex>
        </div>
    );
}