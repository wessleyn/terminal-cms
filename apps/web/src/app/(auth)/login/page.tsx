import { getAuthErrorMessage } from '@repo/auth';
import { redirect } from 'next/navigation';
import BinaryBackground from "../_components/BinaryBackground";
import SessionContinue from '../_components/SessionContinue';
import LoginForm from "./_components/LoginForm";

// Binary background with floating green, terminal-like ones and zeros implemented
export default async function LoginPage({
    searchParams
}: {
    searchParams: Promise<{
        callbackUrl?: string,
        token?: string,
        email?: string,
        error?: string
    }>
}) {
    // Get the callback URL from search params
    const resolvedParams = await searchParams;
    // Ensure callbackUrl is always a string
    const callbackUrl = resolvedParams.callbackUrl || '/dashboard';

    // Check if there's an error coming from NextAuth
    const errorCode = resolvedParams.error;
    let errorMessage = '';

    if (errorCode) {
        // Log the actual error for debugging
        console.log(`Login page received error: ${errorCode}`);

        // Get the appropriate error message using our utility function
        errorMessage = getAuthErrorMessage(errorCode);

        // Return the login form with the error message
        return (
            <>
                <SessionContinue callbackUrl={callbackUrl} />
                <BinaryBackground />
                <LoginForm callbackUrl={callbackUrl} error={errorMessage} clearUrlParams={true} />
            </>
        );
    }

    // Handle magic link authentication if token and email are present
    if (resolvedParams.token && resolvedParams.email) {
        try {
            // We're not actually using the MagicSignIn function here,
            // so we can remove the FormData creation that was causing errors
            console.log("Authentication token detected");

            // Call MagicSignIn with the token and email - mocked for now
            const result = 'hi'; // Mocked result
            console.log("Authenticating yielded: ", result);

            // If authentication was successful (no error returned), redirect
            if (!result) {
                redirect(callbackUrl);
            } else {
                // If there was an error, show login form with the error message
                return (
                    <>
                        <SessionContinue callbackUrl={callbackUrl} />
                        <BinaryBackground />
                        <LoginForm callbackUrl={callbackUrl} error={result} clearUrlParams={true} />
                    </>
                );
            }
        } catch (error) {
            // Handle specific error types
            let errorMsg = "Authentication failed. Please try again.";

            // Check if the error is a token error
            if (error instanceof Error) {
                if (error.message.includes('token-already-used') ||
                    error.message.includes('VerificationTokenError')) {
                    errorMsg = getAuthErrorMessage("token-already-used");
                }
            }

            // Show login form with error message
            return (
                <>
                    <SessionContinue callbackUrl={callbackUrl} />
                    <BinaryBackground />
                    <LoginForm callbackUrl={callbackUrl} error={errorMsg} clearUrlParams={true} />
                </>
            );
        }
    }

    // If no token/email or authentication failed, show the login form
    return (
        <>
            <SessionContinue callbackUrl={callbackUrl} />
            <BinaryBackground />
            <LoginForm callbackUrl={callbackUrl} clearUrlParams={resolvedParams.error !== undefined} />
        </>
    );
}