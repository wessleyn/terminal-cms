'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { NewsletterFormState } from './types';

export async function handlePostSubscription(email: string, postId: string): Promise<NewsletterFormState> {
    console.log(`[handlePostSubscription] Processing subscription for email: ${email}, postId: ${postId}`);

    try {
        // Check if this subscriber already exists for this post
        const existingSubscriber = await prisma.postSubscriber.findFirst({
            where: {
                email,
                subsribedPostId: postId,
                unsubscribedAt: null,
            }
        });

        if (existingSubscriber) {
            console.log(`[handlePostSubscription] User ${email} already subscribed to post ${postId}`);
            return {
                success: true,
                message: 'You are already subscribed to updates for this post.'
            };
        }

        // Create a new post subscriber
        console.log(`[handlePostSubscription] Creating new subscription for ${email} to post ${postId}`);
        await prisma.postSubscriber.create({
            data: {
                email,
                subsribedPostId: postId,
            },
        });

        // Revalidate the blog post page
        console.log(`[handlePostSubscription] Revalidating path: /blog/${postId}`);
        revalidatePath(`/blog/${encodeURIComponent(postId)}`);

        return {
            success: true,
            message: 'You have successfully subscribed to updates for this post!'
        };
    } catch (error) {
        console.error('[handlePostSubscription] Error:', error);
        return {
            success: false,
            message: 'Failed to process subscription. Please try again.'
        };
    }
}