'use server';

import { prisma } from '@repo/db';

export default async function getCommentsByPostId(postId: string) {
  try {
    // Fetch approved comments for this post
    const comments = await prisma.blogComment.findMany({
      where: {
        postId: postId,
        isApproved: true,
        parentId: null // Only get top-level comments
      },
      orderBy: { createdAt: 'desc' },
      include: {
        replies: {
          where: { isApproved: true },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}