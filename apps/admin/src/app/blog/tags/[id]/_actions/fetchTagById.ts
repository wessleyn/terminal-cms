'use server';

import { BlogTagType, prisma } from '@repo/db';

export interface TagDetail {
    id: string;
    name: string;
    slug: string;
    description: string;
    color: string;
    type: BlogTagType;
    postCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export async function fetchTagById(id: string): Promise<TagDetail | null> {
    try {
        const tag = await prisma.blogTag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        if (!tag) {
            return null;
        }

        return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            description: tag.description,
            color: tag.color,
            type: tag.type,
            postCount: tag._count.posts,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt,
        };
    } catch (error) {
        console.error('Error fetching tag:', error);
        return null;
    }
}
