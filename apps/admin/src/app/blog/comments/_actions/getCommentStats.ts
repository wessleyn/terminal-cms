'use server';
import { prisma } from "@repo/db";


export async function getCommentStats() {
    try {
        const [total, approved, rejected] = await Promise.all([
            prisma.blogComment.count(),
            prisma.blogComment.count({ where: { isApproved: true } }),
            prisma.blogComment.count({ where: { isApproved: false } }),
        ]);

        // For pending, count where isApproved is undefined
        const pending = await prisma.blogComment.count({
            where: { isApproved: { equals: undefined } }
        });

        return {
            total,
            approved,
            pending,
            rejected,
        };
    } catch (error) {
        console.error("Error fetching comment stats:", error);
        throw new Error("Failed to fetch comment statistics");
    }
}
