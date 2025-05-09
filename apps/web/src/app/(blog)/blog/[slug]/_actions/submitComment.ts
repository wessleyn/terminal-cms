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
  postId: z.string(),
  slug: z.string() // Add slug to identify the blog post URL
});

export type CommentFormValues = z.infer<typeof CommentSchema>;

export async function submitComment(values: CommentFormValues) {
  try {
    // Validate the input data
    const validatedData = CommentSchema.parse(values);
    // TODO: get the avatar associated with an email just like the gmails!!
    const authorProfile = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(validatedData.name)}`;

    // Create the comment in the database
    await prisma.blogComment.create({
      data: {
        authorProfile,
        authorName: validatedData.name,
        authorEmail: validatedData.email,
        authorWebsite: validatedData.website || null,
        content: validatedData.message,
        parentId: validatedData.parentId,
        postId: validatedData.postId,
        isApproved: true // For demonstration, auto-approve comments
      }
    });

    // Revalidate the specific blog post page
    revalidatePath(`/blog/${validatedData.slug}`);

    return { success: true, message: 'Comment submitted successfully' };
  } catch (error) {
    console.error('Error submitting comment:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({ path: e.path.join('.'), message: e.message }))
      };
    }

    return { success: false, message: 'Failed to submit comment. Please try again later.' };
  }
}