import { prisma } from "@repo/db";

export type CommentStatus = 'pending' | 'approved' | 'rejected' | null;

export interface CommentWithPost {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorWebsite: string | null;
  authorProfile: string;
  isApproved: boolean;
  createdAt: Date;
  post: {
    id: string;
    title: string;
    slug: string;
  };
  parent: {
    id: string;
    authorName: string;
    content: string;
  } | null;
  replies: {
    id: string;
    authorName: string;
    content: string;
    isApproved: boolean;
    createdAt: Date;
  }[];
}

export async function fetchComments(status: CommentStatus = null, searchQuery?: string): Promise<CommentWithPost[]> {
  try {
    // Build where clause based on status
    const whereClause: Record<string, unknown> = {};

    if (status) {
      switch (status) {
        case 'approved':
          whereClause.isApproved = true;
          break;
        case 'rejected':
          whereClause.isApproved = false;
          break;
        case 'pending':
          // For pending, we need to handle undefined/null values in a boolean field
          whereClause.isApproved = { equals: undefined };
          break;
      }
    }

    // Add search query filtering if provided
    if (searchQuery) {
      whereClause.OR = [
        { content: { contains: searchQuery, mode: 'insensitive' } },
        { authorName: { contains: searchQuery, mode: 'insensitive' } },
        { authorEmail: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const comments = await prisma.blogComment.findMany({
      where: whereClause,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parent: {
          select: {
            id: true,
            authorName: true,
            content: true,
          },
        },
        replies: {
          select: {
            id: true,
            authorName: true,
            content: true,
            isApproved: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

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
