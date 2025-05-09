'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the schema for form validation
const formSchema = z.object({
    clientName: z.string().min(1, 'Name is required'),
    clientEmail: z.string().email('Valid email is required'),
    projectName: z.string().min(1, 'Project name is required'),
    projectBudget: z.string().min(1, 'Project budget is required'),
    projectDescription: z.string().min(1, 'Project description is required'),
    scheduleMeetingDate: z.string().min(1, 'Meeting date is required'),
    'cf-turnstile-response': z.string().optional(),
});

export interface HireMeFormState {
    errors?: {
        clientName?: string[];
        clientEmail?: string[];
        projectName?: string[];
        projectBudget?: string[];
        projectDescription?: string[];
        scheduleMeetingDate?: string[];
        _form?: string[];
    };
    message?: string;
    success?: boolean;
}

export async function hireMe(prevState: HireMeFormState | undefined, formData: FormData): Promise<HireMeFormState> {
    try {
        // Extract data from the FormData object
        const rawData = {
            clientName: formData.get('clientName'),
            clientEmail: formData.get('clientEmail'),
            projectName: formData.get('projectName'),
            projectBudget: formData.get('projectBudget'),
            projectDescription: formData.get('projectDescription'),
            scheduleMeetingDate: formData.get('scheduleMeetingDate'),
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


        await prisma.scheduledMeeting.create({
            data: {
               ...result.data,
                scheduleMeetingDate: new Date(result.data.scheduleMeetingDate)
            },
        });

        // Revalidate the hireMe page
        revalidatePath('/hireMe');

        return {
            success: true,
            message: 'Meeting scheduled successfully!'
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