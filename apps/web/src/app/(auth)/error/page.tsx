'use client';

import { Alert, Button, Center, Container, Paper, Text, Title } from '@repo/ui/components/mantine';
import { IconAlertCircle } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthErrorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const [isTokenUrl, setIsTokenUrl] = useState(false);

    useEffect(() => {
        // Safely check window.location.href in the browser
        const href = window.location.href || '';
        setIsTokenUrl(href.includes('token'));
    }, []);

    // Map error codes to friendly messages
    const getErrorMessage = () => {
        switch (error) {
            // Add custom error for verification token issues
            case 'verification-token-expired':
                return 'This sign-in link has expired or has already been used. Please request a new link.';
            case 'VerificationTokenError':
                return 'This sign-in link has expired or has already been used. Please request a new link.';
            case 'Configuration':
                // Special handling for AdapterError which often means the token was already used
                if (isTokenUrl) {
                    return 'This sign-in link has expired or has already been used. Please request a new link.';
                }
                return 'There was a problem with the authentication configuration. Please try again later.';
            case 'OAuthSignin':
                return 'Error starting the sign in process. Please try again.';
            case 'OAuthCallback':
                return 'Error processing the sign in response. Please try again.';
            case 'OAuthCreateAccount':
                return 'Could not create a user account. Please try again later.';
            case 'EmailCreateAccount':
                return 'Could not create a user account using email. Please try again later.';
            case 'Callback':
                return 'Error processing the sign in callback. Please try again.';
            case 'OAuthAccountNotLinked':
                return 'To confirm your identity, sign in with the same account you used originally.';
            case 'EmailSignin':
                return 'The e-mail could not be sent. Please try again later.';
            case 'CredentialsSignin':
                return 'Sign in failed. Check that your credentials are correct.';
            case 'SessionRequired':
                return 'Please sign in to access this page.';
            case 'Default':
            default:
                return 'An unexpected error occurred. Please try again later.';
        }
    };

    const goToLogin = () => {
        router.push('/login');
    };

    const getErrorTitle = () => {
        // Show a more friendly title for token errors
        if (error === 'verification-token-expired' ||
            error === 'VerificationTokenError') {
            return 'Link Expired';
        }
        return 'Authentication Error';
    };

    const isTokenError = error === 'verification-token-expired' ||
        error === 'VerificationTokenError' ||
        (error === 'Configuration' && isTokenUrl);

    return (
        <Container size="sm" py="xl">
            <Paper radius="md" p="xl" withBorder shadow="md">
                <Center>
                    <Title order={2} mb="md" c="red">{getErrorTitle()}</Title>
                </Center>

                <Alert
                    icon={<IconAlertCircle size="1rem" />}
                    title={isTokenError ? "Link Already Used" : "Something went wrong"}
                    color="red"
                    mb="xl"
                >
                    {getErrorMessage()}
                </Alert>

                <Text ta="center" mt="md" mb="xl" c="dimmed">
                    {isTokenError
                        ? "You'll need to request a new sign-in link to access your account."
                        : "Please try again or contact support if the problem persists."}
                </Text>

                <Center>
                    <Button onClick={goToLogin} variant="light" radius="md">
                        Return to Login
                    </Button>
                </Center>
            </Paper>
        </Container>
    );
}