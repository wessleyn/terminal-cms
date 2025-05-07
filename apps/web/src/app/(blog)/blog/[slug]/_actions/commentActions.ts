'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define validation schema
const CommentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  message: z.string().min(5, 'Comment must be at least 5 characters'),
  parentId: z.string().optional().nullable(),
  postId: z.string()
});

export type CommentFormValues = z.infer<typeof CommentSchema>;

export async function submitComment(values: CommentFormValues) {
  try {
    // Validate the input data
    const validatedData = CommentSchema.parse(values);
    
    // Create the comment in the database
    const comment = await prisma.blogComment.create({
      data: {
        authorName: validatedData.name,
        authorEmail: validatedData.email,
        authorWebsite: validatedData.website || null,
        content: validatedData.message,
        parentId: validatedData.parentId,
        postId: validatedData.postId,
        isApproved: true // For demonstration, auto-approve comments
      }
    });
    
    // Revalidate the blog post path to show the new comment
    revalidatePath(`/blog/${comment.postId}`);
    
    return { success: true, message: 'Comment submitted successfully' };
  } catch (error) {
    console.error('Error submitting comment:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: 'Validation failed', 
        errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
      };
    }
    
    return { success: false, message: 'Failed to submit comment. Please try again later.' };
  }
}

export async function getCommentsByPostId(postId: string) {
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