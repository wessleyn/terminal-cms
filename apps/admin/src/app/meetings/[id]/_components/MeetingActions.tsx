'use client';

import { MeetingStatus } from '@repo/db/types';
import {
    Button,
    Flex,
    IconCheck,
    IconMail,
    IconRefresh,
    IconTrash,
    IconX,
    Select,
    Title
} from '@repo/ui/components/mantine';
import Link from 'next/link';
import { useState } from 'react';
import { deleteMeeting } from '../../_actions/deleteMeeting';
import { updateMeetingStatus } from '../../_actions/updateMeetingStatus';

interface MeetingActionsProps {
    meetingId: string;
    clientEmail: string;
    projectName: string;
    currentStatus: MeetingStatus;
}

export function MeetingActions({
    meetingId,
    clientEmail,
    projectName,
    currentStatus
}: MeetingActionsProps) {
    const [status, setStatus] = useState<MeetingStatus>(currentStatus);

    const statusOptions = [
        { value: 'PENDING', label: 'Pending', color: 'gray' },
        { value: 'CONFIRMED', label: 'Confirmed', color: 'blue' },
        { value: 'COMPLETED', label: 'Completed', color: 'green' },
        { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
        { value: 'RESCHEDULED', label: 'Rescheduled', color: 'yellow' },
    ];

    const handleStatusUpdate = (formData: FormData) => {
        formData.set('newStatus', status);
        updateMeetingStatus(formData);
    };

    return (
        <>
            <Title order={4} mt="xl" mb="md" className="terminal-heading">
                $ ./manage-meeting.sh
            </Title>

            <form action={handleStatusUpdate}>
                <Flex direction="row" gap="md" className="terminal-command-group">
                    <input type="hidden" name="meetingId" value={meetingId} />

                    <Select
                        label="Update meeting status:"
                        placeholder="Select status"
                        value={status}
                        onChange={(value) => setStatus(value as MeetingStatus)}
                        data={statusOptions}
                        className="terminal-select"
                        mb="md"
                    />

                    <Button
                        type="submit"
                        leftSection={getStatusIcon(status)}
                        className="terminal-btn"
                        color={getStatusColor(status)}
                        disabled={status === currentStatus}
                        mb="xs"
                    >
                        Update Status
                    </Button>

                    <Button
                        component={Link}
                        href={`/emails?email=${encodeURIComponent(clientEmail)}&subject=${encodeURIComponent(`Re: Meeting about ${projectName}`)}`}
                        leftSection={<IconMail size={16} />}
                        className="terminal-btn"
                        variant="outline"
                        mb="xs"
                    >
                        Contact Client
                    </Button>

                    <form action={deleteMeeting}>
                        <input type="hidden" name="meetingId" value={meetingId} />
                        <Button
                            type="submit"
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            className="terminal-btn-danger"
                            variant="outline"
                        >
                            Delete Meeting
                        </Button>
                    </form>
                </Flex>
            </form>
        </>
    );
}

function getStatusIcon(status: MeetingStatus) {
    switch (status) {
        case 'COMPLETED': return <IconCheck size={16} />;
        case 'CANCELLED': return <IconX size={16} />;
        case 'RESCHEDULED': return <IconRefresh size={16} />;
        default: return <IconCheck size={16} />;
    }
}

function getStatusColor(status: MeetingStatus): string {
    switch (status) {
        case 'COMPLETED': return 'green';
        case 'CONFIRMED': return 'blue';
        case 'CANCELLED': return 'red';
        case 'RESCHEDULED': return 'yellow';
        case 'PENDING':
        default: return 'gray';
    }
}