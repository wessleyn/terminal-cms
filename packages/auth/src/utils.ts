'use server'

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from "./auth";

export async function SignOut() { await signOut(); }

export async function socialSignIn(prevState: string | undefined, formData: FormData) {
    const action = formData.get('action') as string;
    const callbackUrl = formData.get('callbackUrl') as string;

    console.log("Authenticating :", action, " TO callback ", callbackUrl)

    try {
        await signIn(action, { callbackUrl: callbackUrl });
    } catch (error) {
        if (error instanceof AuthError) {
            // In NextAuth v5, AuthError doesn't have a type property
            // Using error.cause or error.message instead for error handling
            if (error.message.includes('CredentialsSignin')) {
                return 'Invalid credentials.';
            }
            return 'Something went wrong.';
        }
        throw error;
    }
}

export async function MagicSignIn(formData: FormData) {
    const name = formData.get('name') as string
    const terms = formData.get('terms') as string

    if (name) { // we're signing up
        console.log("Signin up")
        if (!terms) {
            return 'You must accept the terms and conditions.';
        } else {
            // create something like an acc withthe provided name
        }
    }
    await signIn("resend", formData)
}

// Get current user session helper
export async function getCurrentUser() {
    const session = await auth();
    if (session == null) redirect(`${process.env.WEB_PUBLIC_URL}/login`);
    if( session.user == null ) redirect(`${process.env.WEB_PUBLIC_URL}/login`);
    const user = {
        ...session.user,
        role: session.user.role 
    }
    return user
}
