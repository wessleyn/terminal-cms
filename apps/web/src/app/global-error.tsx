'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        // Only log in client-side environment to avoid build-time errors
        if (typeof window !== 'undefined') {
            console.error('Global error:', error);
        }
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center p-6">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Something went terribly wrong!</h1>
                    <p className="text-lg mb-6">{error.message || 'An unexpected error occurred'}</p>
                    <button
                        onClick={reset}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}