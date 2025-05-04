import { prisma } from '@repo/db';
import {
    Badge,
    Container,
    Group,
    Paper,
    Text,
    Title
} from '@repo/ui/components/mantine';
import MeetingsTimeline from './_components/MeetingsTimeline';

export default async function ProjectMeetingsPage() {
    // Fetch all scheduled meetings from the database
    const meetings = await prisma.scheduledMeeting.findMany({
        orderBy: {
            scheduleMeetingDate: 'desc',
        },
    });

    return (
        <Container size="xl" p="md">
            <Group justify="space-between" mb="lg">
                <Title order={2}>Project Meetings</Title>
                <Badge size="lg" variant="filled" color="blue">
                    {meetings.length} Meeting{meetings.length !== 1 ? 's' : ''}
                </Badge>
            </Group>

            <Text c="dimmed" mb="xl">
                View all scheduled meetings from potential clients. Click on a meeting card to view details or respond.
            </Text>

            {meetings.length === 0 ? (
                <Paper p="xl" withBorder ta="center">
                    <Title order={3} mb="sm">No meetings scheduled yet</Title>
                    <Text c="dimmed">
                        When someone submits a hire request form, it will appear here
                    </Text>
                </Paper>
            ) : (
                <MeetingsTimeline meetings={meetings} />
            )}
        </Container>
    );
}