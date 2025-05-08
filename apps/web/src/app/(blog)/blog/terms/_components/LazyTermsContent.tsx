'use client';

import { PrivacySection } from '@repo/db';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

// Dynamically import the client component with SSR disabled
const TermsOfServiceContent = dynamic(() => import('./TermsOfServiceContent'), {
    loading: () => <div className="loading-placeholder">Loading terms of service...</div>,
    ssr: false // Only disable SSR here in a client component
});

interface LazyTermsContentProps {
    sections: PrivacySection[];
    updatedAt: Date | string;
    descPhrase: string;
    errorMessage?: string;
}

export default function LazyTermsContent({
    sections,
    updatedAt,
    descPhrase,
    errorMessage
}: LazyTermsContentProps) {
    const [isClient, setIsClient] = useState(false);

    // Ensure hydration doesn't cause mismatches
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div className="loading-placeholder">Loading terms of service...</div>;
    }

    return (
        <Suspense fallback={<div className="loading-placeholder">Loading terms of service...</div>}>
            <TermsOfServiceContent
                sections={sections}
                updatedAt={updatedAt}
                descPhrase={descPhrase}
                errorMessage={errorMessage}
            />
        </Suspense>
    );
}