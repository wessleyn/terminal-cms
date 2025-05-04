'use client';

import { showNotification } from '@mantine/notifications';
import { MeetingStatus } from '@repo/db/types';
import {
    Badge,
    Group,
    Menu,
    Title
} from '@repo/ui/components/mantine';
import {
    IconCheck,
    IconChevronDown,
    IconMail,
    IconRefresh,
    IconTrash,
    IconX
} from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { deleteMeeting } from '../../_actions/deleteMeeting';
import { updateMeetingStatus } from '../../_actions/updateMeetingStatus';

interface MeetingHeaderProps {
    clientName: string;
    clientEmail: string;
    projectName: string;
    meetingId: string;
    status: MeetingStatus;
    scheduleMeetingDate: Date;
}

export function MeetingHeader({
    clientName,
    clientEmail,
    projectName,
    meetingId,
    status,
    scheduleMeetingDate
}: MeetingHeaderProps) {
    const [currentStatus, setCurrentStatus] = useState<MeetingStatus>(status);
    const isPast = new Date(scheduleMeetingDate) < new Date();

    const getStatusColor = (statusValue: MeetingStatus = currentStatus) => {
        switch (statusValue) {
            case 'COMPLETED':
                return 'green';
            case 'CONFIRMED':
                return 'blue';
            case 'CANCELLED':
                return 'red';
            case 'RESCHEDULED':
                return 'yellow';
            case 'PENDING':
            default:
                return isPast ? 'gray' : 'blue';
        }
    };

    const getStatusLabel = () => {
        if (currentStatus === 'PENDING' && isPast) {
            return 'Past Meeting';
        }
        return currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase();
    };

    const getStatusIcon = (statusValue: MeetingStatus) => {
        switch (statusValue) {
            case 'COMPLETED': return <IconCheck size={16} />;
            case 'CANCELLED': return <IconX size={16} />;
            case 'RESCHEDULED': return <IconRefresh size={16} />;
            default: return <IconCheck size={16} />;
        }
    };

    const statusOptions = [
        { value: 'PENDING', label: 'Pending', color: 'gray' },
        { value: 'CONFIRMED', label: 'Confirmed', color: 'blue' },
        { value: 'COMPLETED', label: 'Completed', color: 'green' },
        { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
        { value: 'RESCHEDULED', label: 'Rescheduled', color: 'yellow' },
    ];

    const handleStatusUpdate = async (formData: FormData) => {
        formData.set('meetingId', meetingId);
        formData.set('newStatus', formData.get('status') as string);

        try {
            showNotification({
                id: 'status-update',
                loading: true,
                title: 'Updating meeting status',
                message: 'Please wait while we update the meeting status...',
                autoClose: false,
                withCloseButton: false,
            });

            await updateMeetingStatus(formData);

            setCurrentStatus(formData.get('status') as MeetingStatus);

            showNotification({
                id: 'status-update',
                color: 'green',
                title: 'Status updated successfully',
                message: `Meeting is now marked as ${formData.get('status')}`,
                icon: <IconCheck size="1rem" />,
                autoClose: 3000,
            });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            showNotification({
                id: 'status-update',
                color: 'red',
                title: 'Error updating status',
                message: 'Something went wrong. Please try again.',
                icon: <IconX size="1rem" />,
                autoClose: 3000,
            });
        }
    };

    const handleDeleteMeeting = async (formData: FormData) => {
        formData.set('meetingId', meetingId);

        try {
            showNotification({
                id: 'delete-meeting',
                loading: true,
                title: 'Deleting meeting',
                message: 'Please wait while we delete the meeting...',
                autoClose: false,
                withCloseButton: false,
            });

            await deleteMeeting(formData);

            showNotification({
                id: 'delete-meeting',
                color: 'green',
                title: 'Meeting deleted',
                message: 'The meeting has been successfully deleted',
                icon: <IconCheck size="1rem" />,
                autoClose: 3000,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            showNotification({
                id: 'delete-meeting',
                color: 'red',
                title: 'Error deleting meeting',
                message: 'Something went wrong. Please try again.',
                icon: <IconX size="1rem" />,
                autoClose: 3000,
            });
        }
    };

    return (
        <Group justify="space-between" mb="md" align="center" className="terminal-section">
            <Title order={2} className="terminal-text">
                $ meet --client=&quot;{clientName}&quot;
            </Title>

            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <Badge
                        size="lg"
                        variant="filled"
                        color={getStatusColor()}
                        className="terminal-badge"
                        rightSection={<IconChevronDown size={12} />}
                        style={{ cursor: 'pointer' }}
                    >
                        {getStatusLabel()}
                    </Badge>
                </Menu.Target>

                <Menu.Dropdown className="terminal-dropdown">
                    <Menu.Label>Update Status</Menu.Label>
                    {statusOptions.map((option) => (
                        <Menu.Item
                            key={option.value}
                            leftSection={getStatusIcon(option.value as MeetingStatus)}
                            color={option.color}
                            disabled={option.value === currentStatus}
                            onClick={() => {
                                const formData = new FormData();
                                formData.set('status', option.value);
                                handleStatusUpdate(formData);
                            }}
                        >
                            {option.label}
                        </Menu.Item>
                    ))}

                    <Menu.Divider />

                    <Menu.Label>Actions</Menu.Label>
                    <Menu.Item
                        component={Link}
                        href={`/emails?email=${encodeURIComponent(clientEmail)}&subject=${encodeURIComponent(`Re: Meeting about ${projectName}`)}`}
                        leftSection={<IconMail size={16} />}
                    >
                        Contact Client
                    </Menu.Item>

                    <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={16} />}
                        onClick={() => {
                            const formData = new FormData();
                            handleDeleteMeeting(formData);
                        }}
                    >
                        Delete Meeting
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
}