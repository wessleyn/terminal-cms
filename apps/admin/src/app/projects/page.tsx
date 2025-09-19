import { Container } from '@mantine/core';
import { prisma } from '@repo/db';
import ProjectsTable, { TableProject } from './_components/ProjectsTable';

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects ",
    description: "Manage your software development projects.",
};

export default async function ProjectsPage() {
    let projects: TableProject[] = []

    try {
        const fetchedProjects = await prisma.project.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            include: {
                projectEngagement: true
            }
        });

        // Transform the prisma data to match the Project interface
        projects = fetchedProjects.map(project => ({
            ...project,
            engagement: project.projectEngagement ? {
                share: project.projectEngagement.shares,
                bookmark: project.projectEngagement.bookmarks,
                like: project.projectEngagement.likes
            } : null
        }));

    } catch (error) {
        console.error('Error fetching projects:', error);
    }

    return (
        <Container fluid px="md" pt="md" style={{ height: 'calc(100vh - 64px)' }}>
            <ProjectsTable initialProjects={projects} />
        </Container>
    );
}
