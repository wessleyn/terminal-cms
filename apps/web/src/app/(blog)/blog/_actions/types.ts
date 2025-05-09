import { z } from 'zod';

// Define subscription types
export type SubscriptionType = 'blog' | 'post' | 'category';

// Define PostCategory enum for type safety
export const PostCategoryEnum = z.enum(['SPELLS', 'POTIONS', 'SCROLLS', 'ARTIFACTS']);
export type PostCategory = z.infer<typeof PostCategoryEnum>;

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

// Schema for category subscription - needs email and category
const categorySubscriptionSchema = z.object({
    ...baseSchema,
    type: z.literal('category'),
    postId: z.null().optional(),
    category: PostCategoryEnum,
});

// Combined schema using discriminated union
export const subscribeSchema = z.discriminatedUnion('type', [
    blogSubscriptionSchema,
    postSubscriptionSchema,
    categorySubscriptionSchema
]);

// Export type for the combined schema
export type SubscribeSchemaType = z.infer<typeof subscribeSchema>;

export interface NewsletterFormState {
    errors?: {
        email?: string[];
        _form?: string[];
        postId?: string[];
        category?: string[];
    };
    message?: string;
    success?: boolean;
}