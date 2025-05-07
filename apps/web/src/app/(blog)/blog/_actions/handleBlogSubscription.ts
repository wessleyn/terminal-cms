'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { NewsletterFormState } from './types';

export async function handleBlogSubscription(email: string): Promise<NewsletterFormState> {
    console.log(`[handleBlogSubscription] Processing blog subscription for email: ${email}`);

    try {
        // Check if this subscriber already exists for the blog
        const existingSubscriber = await prisma.blogSubscriber.findFirst({
            where: {
                email,
                unsubscribedAt: null,
            }
        });

        if (existingSubscriber) {
            console.log(`[handleBlogSubscription] User ${email} already subscribed to blog`);
            return {
                success: true,
                message: 'You are already subscribed to our blog newsletter.'
            };
        }

        // Create a new blog subscriber
        console.log(`[handleBlogSubscription] Creating new blog subscription for ${email}`);
        await prisma.blogSubscriber.create({
            data: {
                email,
            },
        });

        // Revalidate the blog pages
        console.log('[handleBlogSubscription] Revalidating path: /blog');
        revalidatePath('/blog');

        return {
            success: true,
            message: 'You have successfully subscribed to our blog newsletter!'
        };
    } catch (error) {
        console.error('[handleBlogSubscription] Error:', error);
        return {
            success: false,
            errors: {
                _form: ['Failed to process blog subscription. Please try again.']
            }
        };
    }
}