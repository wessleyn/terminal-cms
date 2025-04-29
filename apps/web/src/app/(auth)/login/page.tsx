import { redirect } from 'next/navigation';
import LoginForm from "./_components/LoginForm";

export default async function LoginPage({
    searchParams
}: {
    searchParams: Promise<{
        callbackUrl?: string,
        token?: string,
        email?: string
    }>
}) {
    // Get the callback URL from search params
    const callbackUrl = (await searchParams).callbackUrl ?? '/dashboard';

    // Handle magic link authentication if token and email are present
    const resolvedParams = await searchParams;
    if (resolvedParams.token && resolvedParams.email) {
        try {
            // Create FormData to pass to MagicSignIn
            const formData = new FormData();
            formData.append('token', resolvedParams.token);
            formData.append('email', resolvedParams.email);
            console.log("Athentication token")
            // Call MagicSignIn with the token and email
            const result = 'hi' //await MagicSignIn(formData);
            console.log("Authnticating yielded: ", result)
            // If authentication was successful (no error returned), redirect
            if (!result) {
                redirect(callbackUrl);

            } else {
                // If there was an error, show login form with the error message
                return <LoginForm callbackUrl={callbackUrl} error={result} />;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Show login form with generic error message
            return <LoginForm callbackUrl={callbackUrl} error="Authentication failed. Please try again." />;
        }
    }

    // If no token/email or authentication failed, show the login form
    return <LoginForm callbackUrl={callbackUrl} />;
}