'use server';

import { PostCategory, prisma } from '@repo/db';
import { validateTurnstile } from '@repo/ui/utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define subscription types
export type SubscriptionType = 'blog' | 'post' | 'category';

// Define schema for newsletter subscription validation based on type
const subscribeSchema = z.object({
    email: z.string().email('Valid email is required'),
    type: z.enum(['blog', 'post', 'category']),
    postId: z.string().optional(),
    category: z.enum(['SPELLS', 'POTIONS', 'SCROLLS', 'ARTIFACTS']).optional(),
    'cf-turnstile-response': z.string().optional(),
}).refine(data => {
    // If type is post, postId is required
    if (data.type === 'post') {
        return !!data.postId;
    }
    // If type is category, category is required
    if (data.type === 'category') {
        return !!data.category;
    }
    return true;
}, {
    message: "Missing required field for selected subscription type",
    path: ['_form']
});

export interface NewsletterFormState {
    errors?: {
        email?: string[];
        _form?: string[];
    };
    message?: string;
    success?: boolean;
}

export async function subscribeNewsletter(formData: FormData): Promise<NewsletterFormState> {
    try {
        // Extract data from the FormData object
        const rawData = {
            email: formData.get('email'),
            type: formData.get('type'),
            postId: formData.get('postId'),
            category: formData.get('category'),
            'cf-turnstile-response': formData.get('cf-turnstile-response'),
        };

        // Validate Turnstile token
        const turnstileResult = await validateTurnstile(rawData['cf-turnstile-response'] as string | null);
        if (!turnstileResult.success) {
            return {
                success: false,
                errors: {
                    _form: [turnstileResult.errorMessage || 'CAPTCHA verification failed. Please try again.']
                }
            };
        }

        // Validate form data using Zod
        const result = subscribeSchema.safeParse(rawData);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            return {
                success: false,
                errors: {
                    ...fieldErrors,
                    _form: ['Please provide a valid email address and all required information.']
                }
            };
        }

        const { email, type } = result.data;

        // Handle different subscription types
        switch (type) {
            case 'post':
                return await handlePostSubscription(email, result.data.postId!);
            case 'category':
                return await handleCategorySubscription(email, result.data.category!);
            case 'blog':
                return await handleBlogSubscription(email);
            default:
                return {
                    success: false,
                    errors: {
                        _form: ['Invalid subscription type.']
                    }
                };
        }
    } catch (error) {
        console.error('Error submitting newsletter form:', error);
        return {
            success: false,
            errors: {
                _form: ['There was an error subscribing you. Please try again.']
            }
        };
    }
}

// Handle subscription to a specific post
async function handlePostSubscription(email: string, postId: string): Promise<NewsletterFormState> {
    // Check if this subscriber already exists for this post
    const existingSubscriber = await prisma.postSubscriber.findFirst({
        where: {
            email,
            subsribedPostId: postId,
            unsubscribedAt: null,
        }
    });

    if (existingSubscriber) {
        return {
            success: true,
            message: 'You are already subscribed to updates for this post.'
        };
    }

    // Create a new post subscriber
    await prisma.postSubscriber.create({
        data: {
            email,
            subsribedPostId: postId,
        },
    });

    // Revalidate the blog post page
    revalidatePath(`/blog/${encodeURIComponent(postId)}`);

    return {
        success: true,
        message: 'You have successfully subscribed to updates for this post!'
    };
}

// Handle subscription to a specific category
async function handleCategorySubscription(email: string, category: string): Promise<NewsletterFormState> {
    // Check if this subscriber already exists for this category
    const existingSubscriber = await prisma.categorySubscriber.findFirst({
        where: {
            email,
            category: category as PostCategory,
            unsubscribedAt: null,
        }
    });

    if (existingSubscriber) {
        return {
            success: true,
            message: `You are already subscribed to updates for the ${category.toLowerCase()} category.`
        };
    }

    // Create a new category subscriber
    await prisma.categorySubscriber.create({
        data: {
            email,
            category: category as PostCategory,
        },
    });

    // Revalidate the category page
    revalidatePath(`/blog/category/${category.toLowerCase()}`);

    return {
        success: true,
        message: `You have successfully subscribed to updates for the ${category.toLowerCase()} category!`
    };
}

// Handle subscription to the general blog
async function handleBlogSubscription(email: string): Promise<NewsletterFormState> {
    // Check if this subscriber already exists for the blog
    const existingSubscriber = await prisma.blogSubscriber.findFirst({
        where: {
            email,
            unsubscribedAt: null,
        }
    });

    if (existingSubscriber) {
        return {
            success: true,
            message: 'You are already subscribed to our blog newsletter.'
        };
    }

    // Create a new blog subscriber
    await prisma.blogSubscriber.create({
        data: {
            email,
        },
    });

    // Revalidate the blog pages
    revalidatePath('/blog');

    return {
        success: true,
        message: 'You have successfully subscribed to our blog newsletter!'
    };
}