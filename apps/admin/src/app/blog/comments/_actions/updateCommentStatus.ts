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

export async function bulkUpdateComments(commentIds: string[], action: CommentAction): Promise<{ success: boolean; message: string; processed: number; failed: number }> {
  let processed = 0;
  const failed = 0;

  try {
    if (action === 'delete') {
      // Delete all comments in one batch operation
      await prisma.blogComment.deleteMany({
        where: {
          id: { in: commentIds },
        },
      });
      processed = commentIds.length;
    } else {
      // For approve/reject, set the isApproved status
      const isApproved = action === 'approve' ? true : false;
      await prisma.blogComment.updateMany({
        where: {
          id: { in: commentIds },
        },
        data: {
          isApproved,
        },
      });
      processed = commentIds.length;
    }

    return {
      success: true,
      message: `Successfully processed ${processed} comments`,
      processed,
      failed,
    };
  } catch (error) {
    console.error(`Error performing bulk ${action}:`, error);
    return {
      success: false,
      message: `Failed to process comments`,
      processed,
      failed: commentIds.length,
    };
  }
}
