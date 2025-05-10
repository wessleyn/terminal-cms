'use server';

import { BlogTagType, prisma } from '@repo/db';

export interface TagWithPostCount {
  id: string;
  name: string;
  slug: string;
  color: string;
  type: BlogTagType;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  postCount: number;
}

export async function fetchAllTags(): Promise<TagWithPostCount[]> {
  try {
    const tags = await prisma.blogTag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      type: tag.type,
      description: tag.description || '',
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
      postCount: tag._count.posts,
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}
