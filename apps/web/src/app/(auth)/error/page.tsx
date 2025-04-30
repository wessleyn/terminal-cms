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
    | 'Default';
// | 'verification-token-expired'
//                 return 'This sign-in link has expired or has already been used. Please request a new link.';
// "You'll need to request a new sign-in link to access your account."
//                     title={isTokenError ? "Link Already Used" : "Something went wrong"}

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
        title: 'Verification Failed',
        message: 'The verification link may have expired or already been used.',
        action: 'Request a New Verification Link',
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
        message: 'To confirm your identity, sign in with the same account you used originally.',
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
    const error = (await params).error as ErrorType | null;
    // Log error for debugging purposes
    if (error) {
        console.error('Authentication error:', error);
    }
    const errorInfo = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

    return (
        <ErrorComp {...errorInfo}>
            <ErrorActionLink url={errorInfo.actionLink!} action={errorInfo.action!} />
            <ErrorActionLink url={'/login'} action={'Log In with a diff Account'} />
        </ErrorComp >
    );
}