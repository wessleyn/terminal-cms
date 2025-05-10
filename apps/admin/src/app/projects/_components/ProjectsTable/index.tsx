'use client';

import { TableHeaderFilter } from '@/app/_components/TableHeaderFilter';
import { Button, Center, Flex, Pagination, Paper, Table, Text } from '@mantine/core';
import { ActivityStatus, HappyIndex, PublishStatus } from '@repo/db';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSearchStore } from '../../../../_stores/searchStore';
import { createProject } from '../../_actions/createProject';
import { deleteProject, UpdateField, updateProjectStatus } from '../../_actions/updateProject';
import ActionButtons from '../ActionButtons';
import ActivityStatusBadge from '../ActivityStatusBadge';
import EngagementBar from '../EngagementBar';
import HappyStatusBadge from '../HappyStatusBadge';
import PublishStatusBadge from '../PublishStatusBadge';
import classes from './ProjectsTable.module.css';

export interface TableProject {
    id: string;
    title: string;
    publishStatus: PublishStatus;
    activityStatus: ActivityStatus;
    happyIndex: HappyIndex;
    engagement: {
        share: number;
        bookmark: number;
        like: number;
    } | null;
}

// Default engagement values when null
const DEFAULT_ENGAGEMENT = {
    share: 33,
    bookmark: 33,
    like: 34
};

interface ProjectsTableProps {
    initialProjects: TableProject[];
}

export default function ProjectsTable({ initialProjects }: ProjectsTableProps) {
    const [projects, setProjects] = useState<TableProject[]>(initialProjects);
    const { query } = useSearchStore(); // Use global search query
    const [filteredProjects, setFilteredProjects] = useState<TableProject[]>(initialProjects);
    const [activePage, setActivePage] = useState(1);
    const router = useRouter();
    const ITEMS_PER_PAGE = 3; // Limit to 3 rows per page

    // Column filters
    const [publishFilters, setPublishFilters] = useState<PublishStatus[]>([]);
    const [activityFilters, setActivityFilters] = useState<ActivityStatus[]>([]);
    const [happyFilters, setHappyFilters] = useState<HappyIndex[]>([]);

    // Filter options
    const publishStatusOptions = Object.values(PublishStatus).map(status => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1)
    }));

    const activityStatusOptions = Object.values(ActivityStatus).map(status => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1)
    }));

    const happyIndexOptions = Object.values(HappyIndex).map(status => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1)
    }));

    // Apply all filters
    const applyFilters = useCallback(() => {
        let filtered = [...projects];

        // Text search filter - now using the global query
        if (query.trim()) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Publish status filter
        if (publishFilters.length > 0) {
            filtered = filtered.filter(project =>
                publishFilters.includes(project.publishStatus)
            );
        }

        // Activity status filter
        if (activityFilters.length > 0) {
            filtered = filtered.filter(project =>
                activityFilters.includes(project.activityStatus)
            );
        }

        // Happy index filter
        if (happyFilters.length > 0) {
            filtered = filtered.filter(project =>
                happyFilters.includes(project.happyIndex)
            );
        }

        setFilteredProjects(filtered);
        setActivePage(1); // Reset to first page when filters change
    }, [projects, query, publishFilters, activityFilters, happyFilters]); // Update dependencies

    // Apply filters whenever any filter changes
    useEffect(() => {
        applyFilters();
    }, [query, publishFilters, activityFilters, happyFilters, applyFilters]);

    // Calculate pagination values
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const paginatedData = filteredProjects.slice(
        (activePage - 1) * ITEMS_PER_PAGE,
        activePage * ITEMS_PER_PAGE
    );

    // Handler for status changes
    const handleStatusChange = useCallback((id: string, field: UpdateField, newStatus: PublishStatus | ActivityStatus | HappyIndex) => {
        // Update local state immediately for responsiveness
        setProjects(prevProjects =>
            prevProjects.map(project =>
                project.id === id ? { ...project, [field]: newStatus } : project
            )
        );

        setFilteredProjects(prevFiltered =>
            prevFiltered.map(project =>
                project.id === id ? { ...project, [field]: newStatus } : project
            )
        );

        // Use the server action to update the status
        updateProjectStatus(id, field, newStatus)
            .then(response => {
                if (!response.success) {
                    console.error(`Failed to update project ${field}:`, response.error);
                    // You could add a toast notification here
                } else {
                    console.log(`Updated project ${id} ${field} to ${newStatus}`);
                }
            })
            .catch(error => {
                console.error('Error updating project:', error);
                // You could add a toast notification here
            });
    }, []);

    // Handler for project deletion with server action
    const handleDelete = useCallback(async (id: string) => {
        try {
            const result = await deleteProject(id);

            if (!result.success) {
                throw new Error(result.error || 'Failed to delete project');
            }

            // Update local state after successful server deletion
            setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
            setFilteredProjects(prevFiltered => prevFiltered.filter(project => project.id !== id));

            console.log(`Deleted project ${id}`);
        } catch (error) {
            console.error('Error deleting project:', error);
            // You could add a toast notification here
        }
    }, []);

    // Handler for project view - navigate to project details page
    const handleView = useCallback((id: string) => {
        router.push(`/projects/${id}`);
    }, [router]);

    // Handler for creating a new project
    const handleCreateProject = useCallback(async () => {
        try {
            const result = await createProject();

            if (result.success && result.data?.id) {
                // Navigate to the new project's page for editing
                router.push(`/projects/${result.data.id}`);
            } else {
                console.error('Failed to create project:', result.error);
                // You could add a toast notification here
            }
        } catch (error) {
            console.error('Error creating project:', error);
            // You could add a toast notification here
        }
    }, [router]);

    // Click handler for row selection
    const handleRowClick = useCallback((id: string) => {
        router.push(`/projects/${id}`);
    }, [router]);

    return (
        <div className={classes.projectsContainer}>
            {/* Remove local search bar and keep the New Project button */}
            <div className={classes.searchContainer}>
                <Flex justify="flex-end" className={classes.topControls}>
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

            {/* Projects Table */}
            <Paper shadow="xs" radius="md" withBorder className={classes.tableContainer}>
                {paginatedData.length > 0 ? (
                    <Table
                        className={`${classes.table} ${paginatedData.length === 1 ? classes.singleRowTable : ''}`}
                        striped
                        highlightOnHover
                        withTableBorder
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Project</Table.Th>
                                <Table.Th>
                                    <TableHeaderFilter
                                        title="Publish Status"
                                        options={publishStatusOptions}
                                        activeFilters={publishFilters}
                                        onChange={setPublishFilters}
                                    />
                                </Table.Th>
                                <Table.Th>
                                    <TableHeaderFilter
                                        title="Activity Status"
                                        options={activityStatusOptions}
                                        activeFilters={activityFilters}
                                        onChange={setActivityFilters}
                                    />
                                </Table.Th>
                                <Table.Th>
                                    <TableHeaderFilter
                                        title="Happy Badge"
                                        options={happyIndexOptions}
                                        activeFilters={happyFilters}
                                        onChange={setHappyFilters}
                                    />
                                </Table.Th>
                                <Table.Th>Engagement</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {paginatedData.map((project, index) => (
                                <Table.Tr
                                    key={project.id}
                                    className={classes[`row${index % 10}`]}
                                    onClick={() => handleRowClick(project.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Table.Td>{project.title}</Table.Td>
                                    <Table.Td onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                        <PublishStatusBadge
                                            status={project.publishStatus}
                                            onStatusChange={(newStatus) =>
                                                handleStatusChange(project.id, 'publishStatus', newStatus)
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                        <ActivityStatusBadge
                                            status={project.activityStatus}
                                            onStatusChange={(newStatus) =>
                                                handleStatusChange(project.id, 'activityStatus', newStatus)
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                        <HappyStatusBadge
                                            status={project.happyIndex}
                                            onStatusChange={(newStatus) =>
                                                handleStatusChange(project.id, 'happyIndex', newStatus)
                                            }
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <EngagementBar engagement={project.engagement || DEFAULT_ENGAGEMENT} />
                                    </Table.Td>
                                    <Table.Td onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                        <ActionButtons
                                            onView={() => handleView(project.id)}
                                            onDelete={() => handleDelete(project.id)}
                                        />
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Center py="xl" className='d-flex justify-content-center align-content-center'>
                        <Text c="dimmed">No projects found</Text>
                    </Center>
                )}
            </Paper>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={classes.paginationContainer}>
                    <Pagination
                        value={activePage}
                        onChange={setActivePage}
                        total={totalPages}
                        className={classes.pagination}
                    />
                </div>
            )}
        </div>
    );
}