'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { NewsletterFormState } from './types';

export async function handleCategorySubscription(email: string, categorySlug: string): Promise<NewsletterFormState> {
    console.log(`[handleCategorySubscription] Processing subscription for email: ${email}, category: ${categorySlug}`);

    try {
        // Find the category by slug
        const category = await prisma.blogCategory.findUnique({
            where: { slug: categorySlug.toLowerCase() }
        });

        if (!category) {
            return {
                success: false,
                message: `Category ${categorySlug} not found`
            };
        }

        // Check if this subscriber already exists for this category
        const existingSubscriber = await prisma.categorySubscriber.findFirst({
            where: {
                email,
                categoryId: category.id,
            },
        });

        if (existingSubscriber) {
            console.log(`[handleCategorySubscription] User ${email} already subscribed to category ${categorySlug}`);
            return {
                success: true,
                message: `You are already subscribed to updates for the ${category.name.toLowerCase()} category.`
            };
        }

        // Create a new category subscriber
        console.log(`[handleCategorySubscription] Creating new subscription for ${email} to category ${categorySlug}`);
        await prisma.categorySubscriber.create({
            data: {
                email,
                categoryId: category.id,
            },
        });

        // Revalidate the category page
        console.log(`[handleCategorySubscription] Revalidating path: /blog/category/${categorySlug.toLowerCase()}`);
        revalidatePath(`/blog/category/${categorySlug.toLowerCase()}`);

        return {
            success: true,
            message: `You have successfully subscribed to updates for the ${category.name.toLowerCase()} category!`
        };
    } catch (error) {
        console.error('[handleCategorySubscription] Error:', error);
        return {
            success: false,
            message: 'Failed to process category subscription. Please try again.'
        };
    }
}