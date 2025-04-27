'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the schema for form validation
const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    message: z.string().min(1, 'Message is required'),
    date: z.string().optional(),
    'cf-turnstile-response': z.string().optional(),
});

export interface HireMeFormState {
    errors?: {
        name?: string[];
        email?: string[];
        message?: string[];
        date?: string[];
        _form?: string[];
    };
    message?: string;
    success?: boolean;
}

export async function hireMe(prevState: HireMeFormState | undefined, formData: FormData): Promise<HireMeFormState> {
    try {
        // Extract data from the FormData object
        const rawData = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            date: formData.get('date'),
            'cf-turnstile-response': formData.get('cf-turnstile-response'),
        };

        // Validate Turnstile token (in production)
        if (process.env.NODE_ENV === 'production') {
            const token = rawData['cf-turnstile-response'];
            if (!token) {
                return {
                    success: false,
                    errors: {
                        _form: ['CAPTCHA verification failed. Please try again.']
                    }
                };
            }

            try {
                // Basic Turnstile verification - in production you would also check the response with Cloudflare API
                if (typeof token !== 'string' || token.length < 10) {
                    return {
                        success: false,
                        errors: {
                            _form: ['Invalid CAPTCHA response. Please try again.']
                        }
                    };
                }
            } catch (error) {
                console.error('Error verifying Turnstile:', error);
                return {
                    success: false,
                    errors: {
                        _form: ['Error verifying CAPTCHA. Please try again.']
                    }
                };
            }
        }

        // Validate form data using Zod
        const result = formSchema.safeParse(rawData);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            return {
                success: false,
                errors: {
                    ...fieldErrors,
                    _form: ['Please correct the errors in the form.']
                }
            };
        }

        const { name, email, message, date } = result.data;

        // Log the form data that would be saved to the database
        console.log('Hire Me Form Submission:', {
            name,
            email,
            message,
            sc: date || new Date().toISOString().split('T')[0],
        });

        await prisma.emailHire.create({
          data: {
            senderName: name,
            email,
            message,
            scheduleDate: date ? new Date(date) : new Date()
          },
        });

        // Revalidate the hireMe page
        revalidatePath('/hireMe');

        return {
            success: true,
            message: 'Form submitted successfully!'
        };
    } catch (error) {
        console.error('Error submitting hire me form:', error);
        return {
            success: false,
            errors: {
                _form: ['There was an error submitting your form. Please try again.']
            }
        };
    }
}