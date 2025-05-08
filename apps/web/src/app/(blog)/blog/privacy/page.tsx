import { Container, Group, Paper, Stack, Text, Title } from '@repo/ui/components/mantine';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { fetchBlogPrivacyPolicy } from './_actions/fetchBlogPrivacy';

export const metadata: Metadata = {
  title: 'Privacy Policy | Terminal Blog',
  description: 'Privacy Policy for Terminal Blog',
};

export default async function BlogPrivacyPolicyPage() {
  const response = await fetchBlogPrivacyPolicy();
  
  if (!response.success || !response.data) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" withBorder>
          <Title order={1}>Privacy Policy</Title>
          <Text mt="lg">Could not load privacy policy. Please try again later.</Text>
        </Paper>
      </Container>
    );
  }
  
  const { sections, updatedAt, descPhrase } = response.data;
  
  return (
    <Container size="md" py="xl">
      <Paper p="xl" withBorder>
        <Stack gap="xl">
          <div>
            <Title order={1}>Privacy Policy</Title>
            <Group mt="md">
              <Text size="sm" c="dimmed">Last updated: {format(new Date(updatedAt), 'MMMM dd, yyyy')}</Text>
            </Group>
          </div>
          
          <Text>{descPhrase}</Text>
          
          {sections.map((section) => (
            <div key={section.id}>
              <Title order={2} mb="sm">{section.title}</Title>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{section.content}</Text>
            </div>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}