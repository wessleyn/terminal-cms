'use server';

import { validateTurnstile } from '@repo/ui/utils';
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
                errors: {
                    _form: ['Please complete the CAPTCHA verification.']
                }
            };
        }

        // Validate turnstile token
        const turnstileResult = await validateTurnstile(turnstileToken);
        console.log('[subscribeNewsletter] Turnstile validation result:', turnstileResult);

        if (!turnstileResult.success) {
            return {
                success: false,
                errors: {
                    _form: [turnstileResult.errorMessage || 'CAPTCHA verification failed. Please try again.']
                }
            };
        }

        // If CAPTCHA is valid, then proceed with form validation
        console.log('[subscribeNewsletter] Validating form data with Zod');
        const validationResult = await subscribeSchema.safeParseAsync(rawData);
        console.log('[subscribeNewsletter] Form validation result success:', validationResult.success);

        if (!validationResult.success) {
            const formattedErrors = validationResult.error.format();
            console.log('[subscribeNewsletter] Form validation errors:', formattedErrors);

            return {
                success: false,
                errors: {
                    ...validationResult.error.flatten().fieldErrors,
                    _form: ['Please provide all required information for the selected subscription type.']
                }
            };
        }

        const { email, type } = validationResult.data;
        console.log(`[subscribeNewsletter] Processing ${type} subscription for ${email}`);

        // Handle different subscription types
        switch (type) {
            case 'post': {
                const postId = validationResult.data.postId;
                console.log(`[subscribeNewsletter] Handling post subscription with ID: ${postId}`);
                return await handlePostSubscription(email, postId);
            }

            case 'category': {
                const category = validationResult.data.category;
                console.log(`[subscribeNewsletter] Handling category subscription for: ${category}`);
                return await handleCategorySubscription(email, category);
            }

            case 'blog':
                console.log('[subscribeNewsletter] Handling blog subscription');
                return await handleBlogSubscription(email);

            default:
                console.log('[subscribeNewsletter] Invalid subscription type:', type);
                return {
                    success: false,
                    errors: {
                        _form: ['Invalid subscription type.']
                    }
                };
        }
    } catch (error) {
        console.error('[subscribeNewsletter] Error processing subscription:', error);
        return {
            success: false,
            errors: {
                _form: ['There was an error subscribing you. Please try again.']
            }
        };
    }
}