'use client';

import { PrivacySection } from '@repo/db';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import PolicyPageSkeleton from '../../_components/PolicyPageSkeleton';

// Dynamically import the client component with SSR disabled
const PrivacyPolicyContent = dynamic(() => import('./PrivacyPolicyContent'), {
    loading: () => <PolicyPageSkeleton />,
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
        return <PolicyPageSkeleton />;
    }

    return (
        <Suspense fallback={<PolicyPageSkeleton />}>
            <PrivacyPolicyContent
                sections={sections}
                updatedAt={updatedAt}
                descPhrase={descPhrase}
                errorMessage={errorMessage}
            />
        </Suspense>
    );
}