'use server';

import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

interface CreateUserInput {
    name: string;
    email: string;
}

interface CreateUserResult {
    success: boolean;
    message: string;
    userId?: string;
}

export default async function createUser(data: CreateUserInput): Promise<CreateUserResult> {
    try {
        const { name, email } = data;

        // Check if email is already in use
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return {
                success: false,
                message: 'Email is already in use by another user'
            };
        }

        // Create the user
        const user = await prisma.user.create({
            data: {
                name,
                email,
            }
        });

        // Revalidate paths
        revalidatePath('/blog/users');

        // TODO: In a real-world app, you'd send a password reset email here

        return {
            success: true,
            message: 'User created successfully',
            userId: user.id
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            success: false,
            message: 'Failed to create user. Please try again.'
        };
    }
}
