'use client';

import { Card } from '@mantine/core';
import { MeetingStatus } from '@repo/db/types';
import { MeetingDetails } from './MeetingDetails';
import { MeetingHeader } from './MeetingHeader';

// Define the meeting note type to match our database schema
type ScheduledMeetingNote = {
    id: string;
    note: string;
    createdAt: Date;
    updatedAt: Date;
};

// Define the meeting type to match our database schema
type ScheduledMeeting = {
    id: string;
    clientName: string;
    clientEmail: string;
    projectName: string;
    projectBudget: string;
    projectDescription: string;
    scheduleMeetingDate: Date;
    status: MeetingStatus;
    meetingNotes: ScheduledMeetingNote[];
    createdAt: Date;
    updatedAt: Date;
};

interface MeetingDetailViewProps {
    meeting: ScheduledMeeting;
}

export default function MeetingDetailView({ meeting }: MeetingDetailViewProps) {


    return (
        <Card shadow="sm" padding="lg" radius="md" className="terminal-card">
            <MeetingHeader
                clientName={meeting.clientName}
                clientEmail={meeting.clientEmail}
                projectName={meeting.projectName}
                meetingId={meeting.id}
                status={meeting.status}
                scheduleMeetingDate={meeting.scheduleMeetingDate}
            />

            <MeetingDetails
                clientName={meeting.clientName}
                clientEmail={meeting.clientEmail}
                projectName={meeting.projectName}
                projectBudget={meeting.projectBudget}
                scheduleMeetingDate={meeting.scheduleMeetingDate}
                projectDescription={meeting.projectDescription}
            />


        </Card>
    );
}