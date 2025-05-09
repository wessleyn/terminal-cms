import { Metadata } from 'next';
import { fetchTermsOfService } from './_actions/fetchTerms';
import LazyTermsContent from './_components/LazyTermsContent';

export const metadata: Metadata = {
    title: 'Terms of Service | Terminal Blog',
    description: 'Terms of Service for Terminal Blog',
};

export default async function BlogTermsOfServicePage() {
    const response = await fetchTermsOfService();

    if (!response.success || !response.data) {
        return (
            <LazyTermsContent
                sections={[]}
                updatedAt={new Date()}
                descPhrase=""
                errorMessage="Could not load terms of service. Please try again later."
            />
        );
    }

    const { sections, updatedAt, descPhrase } = response.data;

    return (
        <LazyTermsContent
            sections={sections}
            updatedAt={updatedAt}
            descPhrase={descPhrase}
        />
    );
}