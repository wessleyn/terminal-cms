'use server';

import { HappyIndex, prisma, Project, PublishStatus } from "@repo/db";

export default async function fetchAwesomeProj(): Promise<Project[]> {
    try {
        // Count awesome projects to determine randomization strategy
        const awesomeProjectCount = await prisma.project.count({
            where: {
                publishStatus: PublishStatus.PUBLISHED,
                happyIndex: HappyIndex.AWESOME,
            }
        });

        // If we have more than 2 projects, use random selection with skip
        if (awesomeProjectCount > 2) {
            // Generate a random skip value to get different projects each time
            const randomSkip = Math.floor(Math.random() * (awesomeProjectCount - 2));

            return await prisma.project.findMany({
                where: {
                    publishStatus: PublishStatus.PUBLISHED,
                    happyIndex: HappyIndex.AWESOME,
                },
                orderBy: {
                    id: 'asc', // Basic ordering that will be randomized by skip
                },
                skip: randomSkip,
                take: 2
            });
        } else {
            // If we have 2 or fewer projects, just return them all
            return await prisma.project.findMany({
                where: {
                    publishStatus: PublishStatus.PUBLISHED,
                    happyIndex: HappyIndex.AWESOME,
                },
                take: 2
            });
        }
    } catch (error) {
        console.error('Error fetching awesome projects:', error);
        return [];
    }
}