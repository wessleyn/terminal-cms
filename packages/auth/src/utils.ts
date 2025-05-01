'use server'

import { prisma } from "@repo/db";
import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from "./auth";

/**
 * Check if a user with the given email exists in the database
 * @param email Email to check
 * @returns Object indicating if the user exists and if they're registered
 */
export async function checkUserExists(email: string): Promise<{ exists: boolean; registered: boolean }> {
    try {
        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, name: true },
        });

        // Return if the user exists and if they have a name (indicating they've completed registration)
        return {
            exists: !!user,
            registered: !!user?.name,
        };
    } catch (error) {
        console.error("Error checking if user exists:", error);
        return {
            exists: false,
            registered: false,
        };
    }
}

/**
 * Register a new user with a magic link
 * @param formData Form data containing email and name
 * @returns Error message if any, or undefined if successful
 */
export async function registerWithMagicLink(formData: FormData): Promise<string | undefined> {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const callbackUrl = formData.get('callbackUrl') as string || '/dashboard';

    if (!email) {
        return "Email is required";
    }

    if (!name) {
        return "Name is required";
    }

    try {
        // Check if user already exists
        const { exists } = await checkUserExists(email);

        if (exists) {
            return "An account with this email already exists. Please sign in instead.";
        }

        // Store the registration data in the VerificationToken's token field as a JSON string
        // We'll use this during the verification process to complete registration
        const registrationData = JSON.stringify({ name });

        // Sign in with the email provider, which will send a magic link
        // The registrationData will be associated with the verification token
        await signIn("resend", {
            email,
            callbackUrl,
            redirect: false,
            // Pass the registration data
            registrationData,
        });

        // Return undefined (success)
        return undefined;
    } catch (error) {
        console.error("Error registering with magic link:", error);
        return "An error occurred during registration. Please try again.";
    }
}

/**
 * Sign in with a magic link
 * @param formData Form data containing email
 * @returns Error message if any, or undefined if successful
 */
export async function MagicSignIn(formData: FormData): Promise<string | undefined> {
    const email = formData.get('email') as string;
    const callbackUrl = formData.get('callbackUrl') as string || '/dashboard';

    if (!email) {
        return "Email is required";
    }

    try {
        // Check if the user exists in the database
        const { exists } = await checkUserExists(email);

        if (!exists) {
            return "No account found with this email. Please register first.";
        }

        // Sign in with the email provider, which will send a magic link
        await signIn("resend", {
            email,
            callbackUrl,
            redirect: false,
        });

        // Return undefined (success)
        return undefined;
    } catch (error) {
        console.error("Error signing in with magic link:", error);
        return "An error occurred while sending the login link. Please try again.";
    }
}

/**
 * Sign in with a social provider (GitHub or Google)
 */
export async function socialSignIn(formData: FormData): Promise<string | undefined> {
    const provider = formData.get('action') as string;
    const callbackUrl = formData.get('callbackUrl') as string || '/dashboard';

    // We're not using try-catch here because signIn with OAuth providers will
    // intentionally throw a NEXT_REDIRECT error, which is normal behavior
    console.log(`Starting OAuth flow with provider: ${provider}`);

    // Sign in with the provider - this will redirect the user
    // so no code after this line will execute
    await signIn(provider, { callbackUrl });

    // This code will never be reached due to the redirect,
    // but we need to return something to satisfy TypeScript
    return undefined;
}

// Get current user session helper
export async function getCurrentUser() {
    const session = await auth();
    if (session == null) redirect(`${process.env.WEB_PUBLIC_URL}/login`);
    if (session.user == null) redirect(`${process.env.WEB_PUBLIC_URL}/login`);
    const user = {
        ...session.user,
        role: session.user.role
    }
    return user
}

/**
 * Server action to check if a user session exists
 * Returns the user data if a session exists, null otherwise
 * Does not redirect if no session is found
 */
export async function checkUserSession() {
    const session = await auth();

    // If no session or user exists, return null
    if (!session?.user) {
        return null;
    }

    // Return the user data
    return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role
    };
}

/**
 * Sign out the current user
 * This is a server action that can be called from the client
 * @param redirectPath Optional path to redirect to after signing out (defaults to '/login')
 */
export async function SignOut(redirectPath: string = '/login') {
    try {
        // Sign out using NextAuth signOut function
        await signOut({ redirect: false });

        // Return success (no redirect here to allow client-side handling)
        return { success: true, error: null };
    } catch (error) {
        console.error('Error signing out:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred during sign out'
        };
    }
}
