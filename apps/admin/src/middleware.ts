import { redirectToLogin, verifySession } from "@repo/auth/src/lib";
import { NextRequest, NextResponse } from "next/server";
const NOT_FOUND_URL = `${process.env.WEB_PUBLIC_URL}/404`

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

export default async function middleware(req: NextRequest) {
    console.log(`Middleware executing for path: ${req.nextUrl.pathname}`);
    
    try {
        console.log("Verifying session...");
        const { authData, hasSession } = await verifySession(req);
        console.log("Session verification result:", { hasSession, role: authData?.role });

        if (!hasSession) {
            console.log("No session found, redirecting to login");
            return redirectToLogin(req);
        }

        if (!authData?.authenticated) {
            console.log("User not authenticated, redirecting to login");
            return redirectToLogin(req);
        }

        if (authData?.role !== "ADMIN") {
            console.log(`User role ${authData?.role} is not ADMIN, redirecting to 404`);
            return NextResponse.redirect(new URL(NOT_FOUND_URL, req.nextUrl.origin));
        }

        console.log("Middleware check passed, proceeding to route");
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        return redirectToLogin(req);
    }
}