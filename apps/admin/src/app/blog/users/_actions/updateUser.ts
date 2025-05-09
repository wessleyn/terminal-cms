'use server';

import { prisma, UserRole } from "@repo/db";
import { revalidatePath } from "next/cache";

interface UpdateUserInput {
    id: string;
    name: string | null;
    email: string;
    role: string;
}

interface UpdateResult {
    success: boolean;
    message: string;
    user?: Record<string, unknown>;
}

export async function updateUser(data: UpdateUserInput): Promise<UpdateResult> {
    try {
        const { id, name, email, role } = data;

        // Validate email
        if (!email || !email.includes('@')) {
            return {
                success: false,
                message: 'Please provide a valid email address'
            };
        }

        // Check if email is already in use by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: {
                    id
                }
            }
        });

        if (existingUser) {
            return {
                success: false,
                message: 'Email is already in use by another user'
            };
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                name,
                email,
                role: role as UserRole // Convert string to enum type
            }
        });

        revalidatePath(`/blog/users/${id}`);
        revalidatePath('/blog/users');

        return {
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        };
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            success: false,
            message: 'Failed to update user. Please try again.'
        };
    }
}
