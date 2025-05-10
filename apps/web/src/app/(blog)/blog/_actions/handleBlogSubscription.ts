'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { NewsletterFormState } from './types';

export async function handleBlogSubscription(email: string): Promise<NewsletterFormState> {
    console.log(`[handleBlogSubscription] Processing subscription for email: ${email}`);

    try {
        // Check if this subscriber already exists
        const existingSubscriber = await prisma.blogSubscriber.findFirst({
            where: {
                email,
                unsubscribedAt: null,
            },
        });

        if (existingSubscriber) {
            console.log(`[handleBlogSubscription] User ${email} already subscribed to blog`);
            return {
                success: true,
                message: 'You are already subscribed to the blog newsletter.',
            };
        }

        // Create a new blog subscriber
        console.log(`[handleBlogSubscription] Creating new subscription for ${email}`);
        await prisma.blogSubscriber.create({
            data: {
                email,
            },
        });

        // Revalidate the blog index page
        console.log(`[handleBlogSubscription] Revalidating path: /blog`);
        revalidatePath('/blog');

        return {
            success: true,
            message: 'You have successfully subscribed to the blog newsletter!',
        };
    } catch (error) {
        console.error('[handleBlogSubscription] Error:', error);
        return {
            success: false,
            message: 'Failed to process subscription. Please try again.',
        };
    }
}