'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

export async function deleteTag(id: string): Promise<{ success: boolean; message: string }> {
    try {
        // Get post count to check if the tag is in use
        const tagWithCount = await prisma.blogTag.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        if (!tagWithCount) {
            return {
                success: false,
                message: 'Tag not found',
            };
        }

        // TODO: If tag is used in  hot posts, prevent deletion
        // if (tagWithCount._count.posts > 0) {
        //     return {
        //         success: false,
        //         message: `Cannot delete tag "${tagWithCount.name}" because it is used in ${tagWithCount._count.posts} posts`,
        //     };
        // }

        // Delete the tag if its mundane 
        await prisma.blogTag.delete({
            where: { id },
        });

        // Revalidate related paths
        revalidatePath('/blog/tags');

        return {
            success: true,
            message: 'Tag deleted successfully',
        };
    } catch (error) {
        console.error('Error deleting tag:', error);
        return {
            success: false,
            message: 'An error occurred while deleting the tag',
        };
    }
}
