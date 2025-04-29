// import { auth } from "@repo/auth/src/auth.config";
import { NextRequest, NextResponse } from "next/server";
const LOGIN_PAGE = `${process.env.WEB_PUBLIC_URL}/login`


export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
        "/dashboard/:path*",
    ],
}

export default async function middleware(req: NextRequest) {
    console.log("Middleware triggered for path:", req.nextUrl.pathname);
    try {
        // Get the session token from cookies
        const sessionCookie = req.cookies.get('authjs.session-token');

        if (!sessionCookie?.value) {
            // If no session token exists, redirect to login
            return redirectToLogin(req);
        }

        const token = sessionCookie.value;

        try {
            // Use API route for verification (database sessions)
            const res = await fetch(`${process.env.WEB_PUBLIC_URL}/api/auth`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await res.json();
            console.log("Session verification response:", data);

            if (!res.ok || !data.authenticated) {
                console.log("Session invalid or expired:", data);
                return redirectToLogin(req);
            }
            console.log("Session verified successfully:", data);

            // Valid session, proceed
            return NextResponse.next();
        } catch (error) {
            console.error("API auth verification failed:", error);
            return redirectToLogin(req);
        }
    } catch (error) {
        console.error("Middleware error:", error);
        return redirectToLogin(req);
    }
}

/**
 * Redirect to login page with callback URL
 */
function redirectToLogin(req: NextRequest) {
    const url = new URL(LOGIN_PAGE, req.nextUrl.origin);
    url.searchParams.set('callbackUrl', req.nextUrl.origin + req.nextUrl.pathname);
    return NextResponse.redirect(url);
}