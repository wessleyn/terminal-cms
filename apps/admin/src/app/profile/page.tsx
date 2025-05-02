import { Container } from '@repo/ui/components/mantine';
import { fetchProfileData } from './_actions/fetchProfileData';
import ProfileEditorWrapper from './_components/ProfileEditorWrapper';

export default async function ProfilePage() {
  // Fetch profile data on the server
  const response = await fetchProfileData();

  if (!response.success || !response.data) {
    // Error handling will be done in the client component
    return (
      <Container size="md" py="xl">
        <ProfileEditorWrapper
          initialProfile={null}
          initialError={response.error || 'Failed to load profile'}
        />
      </Container>
    );
  }

  // Pass the profile data to the client component
  return (
    <Container size="md" py="xl">
      <ProfileEditorWrapper initialProfile={response.data} initialError={null} />
    </Container>
  );
}