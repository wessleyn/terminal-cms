'use server';

import { validateTurnstile } from '@repo/ui/utils/captcha';
import { handleBlogSubscription } from './handleBlogSubscription';
import { handleCategorySubscription } from './handleCategorySubscription';
import { handlePostSubscription } from './handlePostSubscription';
import { NewsletterFormState, subscribeSchema } from './types';

export async function subscribeNewsletter(formData: FormData): Promise<NewsletterFormState> {
    console.log('[subscribeNewsletter] Function called');

    try {
        // Extract and properly format data from the FormData object
        const rawFormData = {
            email: formData.get('email') as string,
            type: formData.get('type') as 'blog' | 'post' | 'category',
            postId: formData.get('postId'),
            category: formData.get('category'),
            'cf-turnstile-response': formData.get('cf-turnstile-response'),
        };

        // Convert empty strings to null for optional fields
        const rawData = {
            ...rawFormData,
            // Normalize values - empty strings should be null
            postId: rawFormData.postId || null,
            category: rawFormData.category || null,
        };

        console.log('[subscribeNewsletter] Raw form data:', rawData);

        // Validate Turnstile token first before proceeding with form validation
        console.log('[subscribeNewsletter] Validating Turnstile token');
        const turnstileToken = rawData['cf-turnstile-response'] as string | null;

        // Check if turnstile token is missing
        if (!turnstileToken) {
            console.log('[subscribeNewsletter] Missing CAPTCHA token');
            return {
                success: false,
                message: 'Please complete the CAPTCHA verification.'
            };
        }

        // Skip Turnstile validation in development environment
        if (process.env.NODE_ENV === 'development') {
            console.log('[subscribeNewsletter] Skipping CAPTCHA validation in development');
        } else {
            // Validate the token
            console.log('[subscribeNewsletter] Validating CAPTCHA token');
            const turnstileResult = await validateTurnstile(turnstileToken);

            if (!turnstileResult.success) {
                console.log('[subscribeNewsletter] CAPTCHA validation failed:', turnstileResult.errorMessage);
                return {
                    success: false,
                    message: 'CAPTCHA validation failed. Please try again.'
                };
            }
        }

        // Validate the form data against our schema
        console.log('[subscribeNewsletter] Validating form data against schema');
        const validationResult = subscribeSchema.safeParse(rawData);

        if (!validationResult.success) {
            console.log('[subscribeNewsletter] Form validation failed:', validationResult.error);
            return {
                success: false,
                message: 'Please correct the errors below.',
                errors: validationResult.error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            };
        }

        // Validated data
        const validatedData = validationResult.data;
        console.log('[subscribeNewsletter] Form data validated successfully');

        // Based on the subscription type, handle accordingly
        switch (validatedData.type) {
            case 'blog':
                console.log('[subscribeNewsletter] Handling blog subscription');
                return await handleBlogSubscription(validatedData.email);

            case 'post':
                if (!validatedData.postId) {
                    console.log('[subscribeNewsletter] Post ID is required for post subscriptions');
                    return {
                        success: false,
                        message: 'Post ID is required for post subscriptions.'
                    };
                }
                console.log('[subscribeNewsletter] Handling post subscription');
                return await handlePostSubscription(validatedData.email, validatedData.postId);

            case 'category':
                if (!validatedData.category) {
                    console.log('[subscribeNewsletter] Category is required for category subscriptions');
                    return {
                        success: false,
                        message: 'Category is required for category subscriptions.'
                    };
                }
                console.log('[subscribeNewsletter] Handling category subscription');
                // Now passing the category slug string instead of an enum value
                return await handleCategorySubscription(validatedData.email, validatedData.category);

            default:
                console.log('[subscribeNewsletter] Unknown subscription type');
                return {
                    success: false,
                    message: 'Invalid subscription type.'
                };
        }
    } catch (error) {
        console.error('[subscribeNewsletter] Error:', error);
        return {
            success: false,
            message: 'An error occurred while processing your subscription. Please try again.'
        };
    }
}