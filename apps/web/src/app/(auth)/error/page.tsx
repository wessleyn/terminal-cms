import ErrorComp, { ErrorActionLink } from "../_components/ErrorComp";

// Error types from NextAuth
type ErrorType =
    | 'Configuration'
    | 'AccessDenied'
    | 'Verification'
    | 'OAuthSignin'
    | 'OAuthCallback'
    | 'OAuthCreateAccount'
    | 'EmailCreateAccount'
    | 'Callback'
    | 'OAuthAccountNotLinked'
    | 'EmailSignin'
    | 'CredentialsSignin'
    | 'SessionRequired'
    | 'VerificationTokenError'  // Custom error type
    | 'Default';

const errorMessages: Record<
    ErrorType,
    { title: string; message: string; action?: string; actionLink?: string }
> = {
    Configuration: {
        title: 'Server Configuration Error',
        message:
            'There is a problem with the server configuration. Please contact support for assistance.',
        action: 'Contact Support',
        actionLink: '/contact',
    },
    AccessDenied: {
        title: 'Access Denied',
        message: 'You do not have permission to sign in to this account.',
        action: 'Sign In with a Different Account',
        actionLink: '/login',
    },
    Verification: {
        title: 'Link Already Used or Expired',
        message: 'The verification link has expired or has already been used.',
        action: 'Request a New Verification Link',
        actionLink: '/login',
    },
    VerificationTokenError: {
        title: 'Link Already Used',
        message: 'This sign-in link has already been used or has expired. Please request a new one.',
        action: 'Request a New Sign-in Link',
        actionLink: '/login',
    },
    OAuthSignin: {
        title: 'OAuth Sign In Error',
        message: 'There was a problem signing in with the OAuth provider.',
        action: 'Try Again',
        actionLink: '/login',
    },
    OAuthCallback: {
        title: 'OAuth Callback Error',
        message: 'There was a problem with the OAuth callback.',
        action: 'Try Again',
        actionLink: '/login',
    },
    OAuthCreateAccount: {
        title: 'Account Creation Failed',
        message: 'There was a problem creating your account with the OAuth provider.',
        action: 'Try a Different Method',
        actionLink: '/login',
    },
    EmailCreateAccount: {
        title: 'Account Creation Failed',
        message: 'There was a problem creating your account with the email provider.',
        action: 'Try Again',
        actionLink: '/login',
    },
    Callback: {
        title: 'Callback Error',
        message: 'There was a problem with the authentication callback.',
        action: 'Try Again',
        actionLink: '/login',
    },
    OAuthAccountNotLinked: {
        title: 'Account Not Linked',
        message: 'This email is already associated with another account. Please sign in with the same method you used originally.',
        action: 'Sign In with a Different Account',
        actionLink: '/login',
    },
    EmailSignin: {
        title: 'Email Sign In Error',
        message: 'The email could not be sent or there was a problem with the email sign in link.',
        action: 'Try Again',
        actionLink: '/login',
    },
    CredentialsSignin: {
        title: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect.',
        action: 'Try Again',
        actionLink: '/login',
    },
    SessionRequired: {
        title: 'Authentication Required',
        message: 'You must be signed in to access this page.',
        action: 'Sign In',
        actionLink: '/login',
    },
    Default: {
        title: 'Authentication Error',
        message: 'An unknown authentication error occurred.',
        action: 'Try Again',
        actionLink: '/login',
    },
};


export default async function ErrorPage({ params }: { params: Promise<{ error: string }> }) {
    // During build time, params might not exist or be accessible
    // so we need to safely handle this case
    let errorParam;
    try {
        errorParam = (await params)?.error;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        // During build, this might fail, so we'll use a fallback
        console.log('Params not available (likely build time), using fallback error message');
        errorParam = 'Default';
    }

    // Map custom token errors to our error type
    let error: ErrorType = (errorParam as ErrorType) || 'Default';

    if (errorParam === 'token-already-used') {
        error = 'VerificationTokenError';
    }

    // Log error for debugging purposes (in production, not during build)
    if (error && process.env.NODE_ENV !== 'production') {
        console.error('Authentication error:', error);
    }

    const errorInfo = errorMessages[error] || errorMessages.Default;

    return (
        <ErrorComp {...errorInfo}>
            <ErrorActionLink url={errorInfo.actionLink!} action={errorInfo.action!} />
            <ErrorActionLink url={'/login'} action={'Log In with a Different Account'} />
        </ErrorComp>
    );
}