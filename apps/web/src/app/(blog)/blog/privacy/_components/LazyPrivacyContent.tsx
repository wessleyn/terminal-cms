'use client';

import { PrivacySection } from '@repo/db';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';

// Dynamically import the client component with SSR disabled
const PrivacyPolicyContent = dynamic(() => import('./PrivacyPolicyContent'), {
    loading: () => <div className="loading-placeholder">Loading privacy policy...</div>,
    ssr: false // Only disable SSR here in a client component
});

interface LazyPrivacyContentProps {
    sections: PrivacySection[];
    updatedAt: Date | string;
    descPhrase: string;
    errorMessage?: string;
}

export default function LazyPrivacyContent({
    sections,
    updatedAt,
    descPhrase,
    errorMessage
}: LazyPrivacyContentProps) {
    const [isClient, setIsClient] = useState(false);

    // Ensure hydration doesn't cause mismatches
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div className="loading-placeholder">Loading privacy policy...</div>;
    }

    return (
        <Suspense fallback={<div className="loading-placeholder">Loading privacy policy...</div>}>
            <PrivacyPolicyContent
                sections={sections}
                updatedAt={updatedAt}
                descPhrase={descPhrase}
                errorMessage={errorMessage}
            />
        </Suspense>
    );
}