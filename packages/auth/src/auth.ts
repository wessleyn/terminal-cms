import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, UserRole } from "@repo/db";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

// Extend the default session types
declare module "next-auth" {
    interface User {
        role: UserRole;
    }
}

interface VerificationTokenRecord {
    identifier: string;
    token: string;
    expires: Date;
}

// Add support for registrationData in NextAuth
declare module "next-auth/providers/resend" {
    interface ResendEmailConfig {
        registrationData?: string;
    }
}

// Custom adapter that extends PrismaAdapter to handle token errors gracefully
function customPrismaAdapter(): Adapter {
    const adapter = PrismaAdapter(prisma);

    return {
        ...adapter,
        // Override the useVerificationToken method to handle errors
        useVerificationToken: async (params: VerificationTokenRecord) => {
            try {
                if (!adapter.useVerificationToken) {
                    throw new Error("useVerificationToken not implemented");
                }
                return await adapter.useVerificationToken(params);
            } catch (error: any) {
                // If the error is due to the token not being found (already used)
                if (
                    error?.name === "PrismaClientKnownRequestError" &&
                    error?.message?.includes("Record to delete does not exist")
                ) {
                    // Use a standardized error type that NextAuth recognizes
                    // This will get passed to the error page correctly
                    const customError = new Error("Verification");
                    customError.name = "VerificationTokenExpired";
                    throw customError;
                }
                // Re-throw other errors
                throw error;
            }
        },
        // Override createVerificationToken to store registrationData if provided
        createVerificationToken: async (data) => {
            if (!adapter.createVerificationToken) {
                throw new Error("createVerificationToken not implemented");
            }

            // Extract registrationData from token if it exists (custom field)
            const token = data.token;

            // Use the standard adapter method to create the token
            return adapter.createVerificationToken(data);
        },
    };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    // Using custom Prisma Adapter for database storage
    adapter: customPrismaAdapter(),
    session: { strategy: "database" },
    debug: process.env.NODE_ENV === "development",
    providers: [
        GitHub,
        Resend({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.RESEND_MAILING_ADDRESS,
        }),
        Google({
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: profile.role ? profile.role : UserRole.USER,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
        signOut: "/signout",
        error: "/login", // Redirect to login page instead of error page for better UX
        verifyRequest: "/verify-request",
    },
    cookies: {
        sessionToken: {
            options: {
                domain: process.env.PUBLIC_DOMAIN
                    ? `.${process.env.PUBLIC_DOMAIN}`
                    : process.env.NODE_ENV === 'development'
                        ? 'localhost'  // Use localhost in development
                        : undefined    // Let the browser determine the domain in production if env not set
            }
        }
    },
    callbacks: {
        // Make the user's role available in the session
        session({ session, user }) {
            if (user) {
                session.user.role = user.role
                session.user.id = user.id
            }
            return session;
        },
        // Handle user creation/update with custom fields during JWT callback
        async signIn({ user, account, profile, email, credentials }) {
            // Extract the registration data if it was passed (for magic link registration)
            const registrationData = (email?.verificationRequest as any)?.registrationData;

            if (registrationData && user.email) {
                try {
                    // Parse the registration data (which contains the user's name)
                    const { name } = JSON.parse(registrationData);

                    // Update the user with the name from registration
                    if (name) {
                        await prisma.user.update({
                            where: { email: user.email },
                            data: { name },
                        });

                        // Update the user object with the name
                        user.name = name;
                    }
                } catch (error) {
                    console.error("Error processing registration data:", error);
                }
            }

            return true;
        },
        // Critical fix for the redirect issue
        redirect({ url, baseUrl }) {
            // Check for presence of a callback URL in the URL itself
            // This handles the case of being redirected to login?callbackUrl=...
            try {
                const urlObj = new URL(url);
                const callbackParam = urlObj.searchParams.get("callbackUrl");

                if (callbackParam) {
                    // We have a callbackUrl in the URL parameters, use it directly
                    return callbackParam;
                }
            } catch (e) {
                // URL parsing failed, continue with normal logic
            }

            // Check if this is an explicit admin URL
            if (url.includes(process.env.ADMIN_PUBLIC_URL!)) {
                return url;
            }

            // For relative URLs, use the baseUrl
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            }

            // Default case - return the URL as is
            return url;
        }
    }
});

