'use server';
import { prisma } from "@repo/db";
import { CommentAction } from "./updateCommentStatus";


export default async function bulkUpdateComments(commentIds: string[], action: CommentAction): Promise<{ success: boolean; message: string; processed: number; failed: number; }> {
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
