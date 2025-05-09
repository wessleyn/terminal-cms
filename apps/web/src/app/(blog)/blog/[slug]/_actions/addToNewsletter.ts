'use server';

import { prisma } from '@repo/db';
import { validateTurnstile } from '@repo/ui/utils/captcha';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the schema for newsletter subscription validation
const subscribeSchema = z.object({
    email: z.string().email('Valid email is required'),
    postId: z.string().min(1, 'Post ID is required'),
    'cf-turnstile-response': z.string().optional(),
});

export interface NewsletterFormState {
    errors?: {
        email?: string[];
        _form?: string[];
    };
    message?: string;
    success?: boolean;
}

export async function addToNewsletter(formData: FormData): Promise<NewsletterFormState> {
    try {
        // Extract data from the FormData object
        const rawData = {
            email: formData.get('email'),
            postId: formData.get('postId'),
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
                    _form: ['Please provide a valid email address.']
                }
            };
        }

        // Check if this subscriber already exists for this post
        const existingSubscriber = await prisma.postSubscriber.findFirst({
            where: {
                email: result.data.email,
                subsribedPostId: result.data.postId,
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
                email: result.data.email,
                subsribedPostId: result.data.postId,
            },
        });

        // Revalidate the blog post page
        revalidatePath(`/blog/${encodeURIComponent(result.data.postId)}`);

        return {
            success: true,
            message: 'You have successfully subscribed to updates for this post!'
        };
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