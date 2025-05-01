// import { auth } from "@repo/auth/src/auth.config";
import { redirectToLogin, verifySession } from "@repo/auth/src/lib";
import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: '/dashboard/:path*',
}

export default async function middleware(req: NextRequest) {
    try {
        // Use the centralized auth verification function
        const { authData, hasSession } = await verifySession(req);

        // No session found, redirect to login
        if (!hasSession) {
            return redirectToLogin(req);
        }

        // Check if the session is authenticated
        if (!authData?.authenticated) {
            console.log("Session invalid or expired:", authData?.reason || "Unknown reason");
            return redirectToLogin(req);
        }

        // Valid session, proceed
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return redirectToLogin(req);
    }
}