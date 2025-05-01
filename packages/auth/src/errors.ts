/**
 * Authentication error messages
 * Provides user-friendly messages for various authentication error types
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
    "Configuration": "There's a server configuration issue. Please try again later or contact support.",
    "Verification": "This verification link has expired or has already been used. Please request a new one.",
    "token-already-used": "This sign-in link has already been used. Please request a new one.",
    "VerificationTokenError": "This sign-in link has already been used. Please request a new one.",
    "OAuthAccountNotLinked": "This email is already associated with another account. Please sign in with the method you used originally.",
    "OAuthSignin": "There was a problem signing in with your account. Please try again or use another method.",
    "OAuthCallback": "There was a problem during the authentication process. Please try again or use another method.",
    "Default": "An error occurred during sign-in. Please try again."
};

/**
 * Get a user-friendly error message for an authentication error code
 * @param errorCode The error code from NextAuth
 * @returns A user-friendly error message
 */
export function getAuthErrorMessage(errorCode: string | undefined): string {
    if (!errorCode) {
        return '';
    }

    // For Verification errors, always use the verification message
    if (errorCode === 'Verification' || errorCode === 'Configuration') {
        return AUTH_ERROR_MESSAGES['Verification'] || '';
    }

    // For other error types, use the mapped error or fall back to default
    return AUTH_ERROR_MESSAGES[errorCode] || AUTH_ERROR_MESSAGES['Default'] || '';
}

/**
 * Error information with title and message for the error page
 */
export type ErrorInfo = {
    title: string;
    message: string;
    action?: string;
    actionLink?: string;
};

/**
 * Error types from NextAuth
 */
export type AuthErrorType =
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
    | 'VerificationTokenError'
    | 'Default';

/**
 * Detailed error messages for the error page
 */
export const ERROR_MESSAGES: Record<AuthErrorType, ErrorInfo> = {
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