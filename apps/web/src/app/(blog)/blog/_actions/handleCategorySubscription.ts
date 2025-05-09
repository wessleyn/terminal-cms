'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { NewsletterFormState, PostCategory } from './types';

export async function handleCategorySubscription(email: string, category: PostCategory): Promise<NewsletterFormState> {
    console.log(`[handleCategorySubscription] Processing subscription for email: ${email}, category: ${category}`);

    try {
        // Check if this subscriber already exists for this category
        const existingSubscriber = await prisma.categorySubscriber.findFirst({
            where: {
                email,
                category,
                unsubscribedAt: null,
            }
        });

        if (existingSubscriber) {
            console.log(`[handleCategorySubscription] User ${email} already subscribed to category ${category}`);
            return {
                success: true,
                message: `You are already subscribed to updates for the ${category.toLowerCase()} category.`
            };
        }

        // Create a new category subscriber
        console.log(`[handleCategorySubscription] Creating new subscription for ${email} to category ${category}`);
        await prisma.categorySubscriber.create({
            data: {
                email,
                category,
            },
        });

        // Revalidate the category page
        console.log(`[handleCategorySubscription] Revalidating path: /blog/category/${category.toLowerCase()}`);
        revalidatePath(`/blog/category/${category.toLowerCase()}`);

        return {
            success: true,
            message: `You have successfully subscribed to updates for the ${category.toLowerCase()} category!`
        };
    } catch (error) {
        console.error('[handleCategorySubscription] Error:', error);
        return {
            success: false,
            errors: {
                _form: ['Failed to process category subscription. Please try again.']
            }
        };
    }
}