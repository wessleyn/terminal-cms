'use server'

import { prisma } from "@repo/db";

export type CommentAction = 'approve' | 'reject' | 'delete';

export async function updateCommentStatus(commentId: string, action: CommentAction): Promise<{ success: boolean; message: string }> {
  try {
    switch (action) {
      case 'approve':
        await prisma.blogComment.update({
          where: { id: commentId },
          data: { isApproved: true },
        });
        return { success: true, message: 'Comment approved successfully' };

      case 'reject':
        await prisma.blogComment.update({
          where: { id: commentId },
          data: { isApproved: false },
        });
        return { success: true, message: 'Comment rejected successfully' };

      case 'delete':
        await prisma.blogComment.delete({
          where: { id: commentId },
        });
        return { success: true, message: 'Comment deleted successfully' };

      default:
        return { success: false, message: 'Invalid action' };
    }
  } catch (error) {
    console.error(`Error performing ${action} action on comment:`, error);
    return { success: false, message: `Failed to ${action} comment` };
  }
}


