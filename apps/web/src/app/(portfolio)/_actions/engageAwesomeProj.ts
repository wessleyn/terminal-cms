'use server'

import { prisma } from "@repo/db";

export type projectEngagement = {
    shares: number;
    bookmarks: number;
    likes: number
}
export default async function engageAwesomeProj(data: projectEngagement, projectId: string) {
    try {
        await prisma.projectEngagement.upsert({
            where: { id: projectId },
            update: {
                shares: data.shares,
                bookmarks: data.bookmarks,
                likes: data.likes
            },
            create: {
                id: projectId,
                shares: data.shares,
                bookmarks: data.bookmarks,
                likes: data.likes
            }
        });
    } catch (error) {
        console.error("Error engaging project:", error);
    }
}