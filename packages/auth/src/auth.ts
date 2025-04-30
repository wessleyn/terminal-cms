import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, UserRole } from "@repo/db";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

// Extend the default session types
declare module "next-auth" {

    interface User {
        role: UserRole;
    }
}

// interface VerificationTokenRecord {
//   identifier: string;
//   token: string;
//   expires: Date;
// }

// Custom adapter that extends PrismaAdapter to handle token errors gracefully
// function customPrismaAdapter(): Adapter {
//   const adapter = PrismaAdapter(prisma);

//   return {
//     ...adapter,
//     // Override the useVerificationToken method to handle errors
//     useVerificationToken: async (params: VerificationTokenRecord) => {
//       try {
//         if (!adapter.useVerificationToken) {
//           throw new Error("useVerificationToken not implemented");
//         }
//         return await adapter.useVerificationToken(params);
//       } catch (error: any) {
//         // If the error is due to the token not being found (already used)
//         if (
//           error?.name === "PrismaClientKnownRequestError" &&
//           error?.message?.includes("Record to delete does not exist")
//         ) {
//           // Throw a custom error that NextAuth can handle
//           const customError = new Error("verification-token-expired");
//           customError.name = "VerificationTokenError";
//           throw customError;
//         }
//         // Re-throw other errors
//         throw error;
//       }
//     },
//   };
// }
// TODO: Throw a custom params to the error page
export const { handlers, signIn, signOut, auth } = NextAuth({
    // Using Prisma Adapter for database storage
    //   adapter: customPrismaAdapter(),
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
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
        error: "/error",
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
        // Critical fix for the redirect issue
        redirect({ url, baseUrl }) {
            // Check for presence of a callback URL in the URL itself
            // This handles the case of being redirected to login?callbackUrl=...
            try {
                const urlObj = new URL(url);
                const callbackParam = urlObj.searchParams.get("callbackUrl");

                if (callbackParam) {
                    // We have a callbackUrl in the URL parameters, use it directly
                    console.log('Using callbackUrl parameter:', callbackParam);
                    return callbackParam;
                }
            } catch (e) {
                // URL parsing failed, continue with normal logic
            }

            // Check if this is an explicit admin URL
            if (url.includes(process.env.ADMIN_PUBLIC_URL!)) {
                console.log('Preserving admin URL:', url);
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

