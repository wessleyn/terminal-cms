'use server';

import { prisma } from "@repo/db";

interface UpdateMailData {
    id: string
    isArchived: boolean
    isTrash: boolean
    isRead: boolean
    isStarred: boolean
    isSpam: boolean
}

export default async function updateMail(data: UpdateMailData) {
    await prisma.email.update({
        where: {
            id: data.id,
        },
        data: {
            ...data
        },
    })
}