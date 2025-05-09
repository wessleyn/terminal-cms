import { Button, Container, Group } from '@mantine/core';
import { prisma } from '@repo/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetailView from './_components/MeetingDetailView';

export default async function MeetingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Ensure params is awaited by accessing it in a separate statement first
    const { id } = await params;

    // Fetch the meeting details by ID
    const meeting = await prisma.scheduledMeeting.findUnique({
        where: { id },
        include: { meetingNotes: true } // Include the meeting notes
    });

    // If meeting doesn't exist, show 404 page
    if (!meeting) {
        notFound();
    }

    return (
        <Container size="lg">
            <Group mb="lg">
                <Button
                    component={Link}
                    href="/meetings"
                    variant="subtle"
                    color="gray"
                >
                    $ cd ../Meetings
                </Button>
            </Group>

            <MeetingDetailView meeting={meeting} />
        </Container>
    );
}