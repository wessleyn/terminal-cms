import { Metadata } from 'next';
import { fetchBlogPrivacyPolicy } from './_actions/fetchBlogPrivacy';
import LazyPrivacyContent from './_components/LazyPrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | Terminal Blog',
  description: 'Privacy Policy for Terminal Blog',
};

export default async function BlogPrivacyPolicyPage() {
  const response = await fetchBlogPrivacyPolicy();

  if (!response.success || !response.data) {
    return (
      <LazyPrivacyContent
        sections={[]}
        updatedAt={new Date()}
        descPhrase=""
        errorMessage="Could not load privacy policy. Please try again later."
      />
    );
  }

  const { sections, updatedAt, descPhrase } = response.data;

  return (
    <LazyPrivacyContent
      sections={sections}
      updatedAt={updatedAt}
      descPhrase={descPhrase}
    />
  );
}