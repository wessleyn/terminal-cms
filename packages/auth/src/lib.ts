import { NextRequest, NextResponse } from "next/server";

/**
 * Interface for the authenticated session data returned by the auth server
 */
export interface AuthSessionData {
    authenticated: boolean;
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        [key: string]: any;
    };
    reason?: string;
    [key: string]: any;
}

/**
 * Get and verify the session token from a Next.js request
 * This function handles both the cookie extraction based on protocol
 * and the verification against the auth API
 * 
 * @param req The Next.js request object
 * @param apiEndpoint The endpoint to verify the auth token (default: WEB_PUBLIC_URL/api/auth)
 * @returns Object containing auth data, cookieName, and session status
 */
export async function verifySession(
    req: NextRequest,
    apiEndpoint?: string
): Promise<{
    authData: AuthSessionData | null;
    cookieName: string;
    hasSession: boolean;
}> {
    // Determine the cookie name based on protocol (HTTP vs HTTPS)
    const isSecureContext = req.nextUrl.protocol === 'https:';
    const cookieName = isSecureContext ? '__Secure-authjs.session-token' : 'authjs.session-token';

    // Get the session cookie if it exists
    const sessionCookie = req.cookies.get(cookieName);
    const hasSession = !!sessionCookie?.value;

    // If no session exists, return early
    if (!hasSession) {
        return { authData: null, cookieName, hasSession };
    }

    try {
        // Determine the API endpoint to use for verification
        const authApiUrl = apiEndpoint || `${process.env.WEB_PUBLIC_URL}/api/auth`;

        // Make the API request to verify the session
        const res = await fetch(authApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionCookie.value}`,
            },
        });

        // Parse the response data
        const authData: AuthSessionData = await res.json();

        return {
            authData,
            cookieName,
            hasSession
        };
    } catch (error) {
        console.error("Session verification error:", error);

        // Return authentication failure on error
        return {
            authData: {
                authenticated: false,
                reason: 'Session verification failed'
            },
            cookieName,
            hasSession
        };
    }
}

/**
 * Redirect to login page with callback URL
 * 
 * @param req The Next.js request object
 * @param loginPath Optional custom login page path (default: WEB_PUBLIC_URL/login)
 * @returns A NextResponse redirect to the login page with the callback URL
 */
export function redirectToLogin(req: NextRequest, loginPath?: string): NextResponse {
    const LOGIN_PAGE = loginPath || `${process.env.WEB_PUBLIC_URL}/login`;
    const url = new URL(LOGIN_PAGE, req.nextUrl.origin);
    url.searchParams.set('callbackUrl', req.nextUrl.origin + req.nextUrl.pathname);
    return NextResponse.redirect(url);
}