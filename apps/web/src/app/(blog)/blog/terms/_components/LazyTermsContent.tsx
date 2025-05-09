'use client';

import { PrivacySection } from '@repo/db';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import PolicyPageSkeleton from '../../_components/PolicyPageSkeleton';

// Dynamically import the client component with SSR disabled
const TermsOfServiceContent = dynamic(() => import('./TermsOfServiceContent'), {
    loading: () => <PolicyPageSkeleton />,
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
        return <PolicyPageSkeleton />;
    }

    return (
        <Suspense fallback={<PolicyPageSkeleton />}>
            <TermsOfServiceContent
                sections={sections}
                updatedAt={updatedAt}
                descPhrase={descPhrase}
                errorMessage={errorMessage}
            />
        </Suspense>
    );
}