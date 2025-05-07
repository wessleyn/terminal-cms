'use server';

import { prisma } from '@repo/db';
import { validateTurnstile } from '@repo/ui/utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the schema for general blog subscription validation
const blogSubscribeSchema = z.object({
    email: z.string().email('Valid email is required'),
    'cf-turnstile-response': z.string().optional(),
});

export interface BlogSubscriptionFormState {
    errors?: {
        email?: string[];
        _form?: string[];
    };
    message?: string;
    success?: boolean;
}

export async function subscribeToNewsletter(formData: FormData): Promise<BlogSubscriptionFormState> {
    try {
        // Extract data from the FormData object
        const rawData = {
            email: formData.get('email'),
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
        const result = blogSubscribeSchema.safeParse(rawData);
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

        // Check if this subscriber already exists for the blog
        const existingSubscriber = await prisma.blogSubscriber.findFirst({
            where: {
                email: result.data.email,
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
                email: result.data.email,
            },
        });

        // Revalidate the blog pages
        revalidatePath('/blog');

        return {
            success: true,
            message: 'You have successfully subscribed to our blog newsletter!'
        };
    } catch (error) {
        console.error('Error submitting blog subscription form:', error);
        return {
            success: false,
            errors: {
                _form: ['There was an error subscribing you. Please try again.']
            }
        };
    }
}