import { handlers } from "@repo/auth";

export const { GET, POST } = handlers;

// Configure API route options
// export const dynamic = 'force-dynamic'; // Don't cache this route
// export const maxDuration = 60; // Extend the serverless function timeout to 5 minutes
// export const fetchCache = 'force-no-store'; // Ensure fetch requests aren't cached
// export const revalidate = 0; // Disable revalidation caching
