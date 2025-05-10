import { z } from 'zod';

// Define subscription types
export type SubscriptionType = 'blog' | 'post' | 'category';

// Base schema with common fields for all subscription types
const baseSchema = {
    email: z.string().email('Valid email is required'),
    'cf-turnstile-response': z.string().nullable().optional(),
};

// Schema for blog subscription - just needs email
const blogSubscriptionSchema = z.object({
    ...baseSchema,
    type: z.literal('blog'),
    postId: z.null().optional(),
    category: z.null().optional(),
});

// Schema for post subscription - needs email and postId
const postSubscriptionSchema = z.object({
    ...baseSchema,
    type: z.literal('post'),
    postId: z.string({
        required_error: "Post ID is required for post subscriptions"
    }),
    category: z.null().optional(),
});

// Schema for category subscription - needs email and category slug (string)
const categorySubscriptionSchema = z.object({
    ...baseSchema,
    type: z.literal('category'),
    postId: z.null().optional(),
    // Update to use string for category slug instead of enum
    category: z.string({
        required_error: "Category slug is required for category subscriptions"
    }),
});

// Combined schema using discriminated union
export const subscribeSchema = z.discriminatedUnion('type', [
    blogSubscriptionSchema,
    postSubscriptionSchema,
    categorySubscriptionSchema
]);

// Export type for the combined schema
export type SubscribeSchemaType = z.infer<typeof subscribeSchema>;

// Update NewsletterFormState to include errors array for validation feedback
export interface NewsletterFormState {
    success: boolean;
    message: string;
    errors?: Array<{ path: string; message: string }>;
}