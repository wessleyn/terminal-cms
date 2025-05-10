'use server'

import { prisma } from "@repo/db";
import { formatDistanceToNow } from "date-fns";

export interface BlogUser {
    id: string;
    avatar: string | null;
    name: string | null
    role: string;
    email: string;
    lastActive: string;
}


export default async function fetchUsers(): Promise<BlogUser[]> {
    const q = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            sessions: {
                orderBy: [
                    { updatedAt: 'desc' },
                    { createdAt: 'desc' }
                ],
                take: 1,
            }
        }
    });


    return q.map((user) => {
        const lastActiveDate = user.sessions[0]?.updatedAt || user.sessions[0]?.createdAt || new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.image,
            role: user.role,
            lastActive: formatDistanceToNow(lastActiveDate, { addSuffix: true }),
        };
    });
}