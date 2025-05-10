'use server'

import { prisma } from "@repo/db";
import { format, formatDistanceToNow } from "date-fns";

export interface UserDetail {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    role: string;
    createdAt: string;
    formattedCreatedAt: string;
    lastActive: string;
    commentMetrics: {
        totalComments: number;
        lastWeekComments: number;
        avgCommentsPerMonth: number;
    };
}

export async function fetchUserDetails(userId: string): Promise<UserDetail | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                sessions: {
                    orderBy: [
                        { updatedAt: 'desc' },
                        { createdAt: 'desc' }
                    ],
                    take: 1,
                }
            }
        });

        if (!user) return null;

        // Get comments for this user's email (supporting anonymous posting)
        const comments = await prisma.blogComment.findMany({
            where: { authorEmail: user.email }
        });

        // Calculate last active date
        const lastActiveDate = user.sessions[0]?.updatedAt ||
            user.sessions[0]?.createdAt ||
            user.updatedAt ||
            new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

        // Calculate comment metrics
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const lastWeekComments = comments.filter(comment =>
            new Date(comment.createdAt) > oneWeekAgo
        ).length;

        const userAgeInMonths = Math.max(1,
            (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
        );

        const avgCommentsPerMonth = Math.round((comments.length / userAgeInMonths) * 10) / 10;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.image,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            formattedCreatedAt: format(user.createdAt, "d MMM yyyy"),
            lastActive: formatDistanceToNow(lastActiveDate, { addSuffix: true }),
            commentMetrics: {
                totalComments: comments.length,
                lastWeekComments: lastWeekComments,
                avgCommentsPerMonth: avgCommentsPerMonth
            }
        };
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
}
