'use server';

import { HappyIndex, prisma, Project, PublishStatus } from "@repo/db";

export default async function fetchAwesomeProj(): Promise<Project[]> {
    // FIXME:Leave this random for varying and dyanmic landing  page
    return await prisma.project.findMany({
        where: {
            publishStatus: PublishStatus.PUBLISHED,
            // activityStatus: ActivityStatus.COMPLETED,
            happyIndex: HappyIndex.AWESOME,
        },
        take: 2
    });
}