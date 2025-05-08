import { Alert, Container, Title } from '@mantine/core';
import { fetchPrivacySections, getPrivacyDetails } from './_actions/fetchPrivacySections';
import DescriptionEditor from './_components/DescriptionEditor';
import { DragNDrop } from './_components/DragNDrop';
import { PrivacyType } from '@repo/db';

export default async function PrivacyPage() {
    const privacyType = PrivacyType.PORTFOLIO;
    const { success, data: privacySections, error } = await fetchPrivacySections(privacyType);
    const privacyDetailsResult = await getPrivacyDetails(privacyType);

    // Get description and last updated date
    let descPhrase = "";
    let lastUpdated = "";

    if (privacyDetailsResult.success && privacyDetailsResult.data) {
        descPhrase = privacyDetailsResult.data.descPhrase;
        lastUpdated = new Date(privacyDetailsResult.data.updatedAt).toLocaleDateString();
    }

    return (
        <Container size="lg" py="xl">
            <Title order={2} mb="lg">Portfolio Privacy Policy</Title>
            <Title order={4} mb="lg" c="dimmed">Last Updated: {lastUpdated}</Title>
            <DescriptionEditor
                initialDesc={descPhrase}
                privacyType={privacyType}
            />

            {!success ? (
                <Alert color="red" title="Error">
                    {error || 'Failed to load privacy sections'}
                </Alert>
            ) : (
                <DragNDrop initialData={privacySections || []} />
            )}
        </Container>
    );
}