import { getAuthErrorMessage } from '@repo/auth';
import { redirect } from 'next/navigation';
import BinaryBackground from "../_components/BinaryBackground";
import SessionContinue from '../_components/SessionContinue';
import LoginForm from "./_components/LoginForm";

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
    const resolvedParams = await searchParams;
    const callbackUrl = resolvedParams.callbackUrl || '/dashboard';

    const errorCode = resolvedParams.error;
    let errorMessage = '';

    if (errorCode) {
        console.log(`Login page received error: ${errorCode}`);

        errorMessage = getAuthErrorMessage(errorCode);

        return (
            <>
                <SessionContinue callbackUrl={callbackUrl} />
                <BinaryBackground />
                <LoginForm callbackUrl={callbackUrl} error={errorMessage} clearUrlParams={true} />
            </>
        );
    }

    if (resolvedParams.token && resolvedParams.email) {
        try {
            console.log("Authentication token detected");

            const result = 'hi';
            console.log("Authenticating yielded: ", result);

            if (!result) {
                redirect(callbackUrl);
            } else {
                return (
                    <>
                        <SessionContinue callbackUrl={callbackUrl} />
                        <BinaryBackground />
                        <LoginForm callbackUrl={callbackUrl} error={result} clearUrlParams={true} />
                    </>
                );
            }
        } catch (error) {
            let errorMsg = "Authentication failed. Please try again.";

            if (error instanceof Error) {
                if (error.message.includes('token-already-used') ||
                    error.message.includes('VerificationTokenError')) {
                    errorMsg = getAuthErrorMessage("token-already-used");
                }
            }

            return (
                <>
                    <SessionContinue callbackUrl={callbackUrl} />
                    <BinaryBackground />
                    <LoginForm callbackUrl={callbackUrl} error={errorMsg} clearUrlParams={true} />
                </>
            );
        }
    }

    return (
        <>
            <SessionContinue callbackUrl={callbackUrl} />
            <BinaryBackground />
            <LoginForm callbackUrl={callbackUrl} clearUrlParams={resolvedParams.error !== undefined} />
        </>
    );
}
