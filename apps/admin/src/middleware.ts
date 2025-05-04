import { redirectToLogin, verifySession } from "@repo/auth/src/lib";
import { NextRequest, NextResponse } from "next/server";
const NOT_FOUND_URL = `${process.env.WEB_PUBLIC_URL}/404`

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

export default async function middleware(req: NextRequest) {
    try {
        // Use the centralized auth verification function
        // const { authData, hasSession } = await verifySession(req);

        // // No session found, redirect to login
        // if (!hasSession) {
        //     return redirectToLogin(req);
        // }

        // // Check authentication status and admin access
        // if (!authData?.authenticated) {
        //     return redirectToLogin(req);
        // }

        // // Check if the user doesn't have admin role
        // if (authData?.role !== "ADMIN") {
        //     return NextResponse.redirect(new URL(NOT_FOUND_URL, req.nextUrl.origin));
        // }

        // Valid admin session, proceed
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return redirectToLogin(req);
    }
}