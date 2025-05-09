'use client';

import {
    Badge,
    Group,
    Text,
    Title
} from '@mantine/core';
import { IconCalendarTime } from '@tabler/icons-react';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

// Define the meeting type to match our database schema
type ScheduledMeeting = {
    id: string;
    clientName: string;
    clientEmail: string;
    projectName: string;
    projectBudget: string;
    projectDescription: string;
    scheduleMeetingDate: Date;
    createdAt: Date;
    updatedAt: Date;
};

interface MeetingsTimelineProps {
    meetings: ScheduledMeeting[];
}

export default function MeetingsTimeline({ meetings }: MeetingsTimelineProps) {
    return (
        <VerticalTimeline>
            {meetings.map((meeting) => {
                const isPast = new Date(meeting.scheduleMeetingDate) < new Date();

                return (
                    <VerticalTimelineElement
                        key={meeting.id}
                        className={`vertical-timeline-element--${isPast ? 'work' : 'education'}`}
                        contentStyle={isPast
                            ? { background: 'var(--mantine-color-gray-7)', color: '#fff' }
                            : { background: 'var(--mantine-color-oklch-blue-6)', color: '#fff' }
                        }
                        contentArrowStyle={isPast
                            ? { borderRight: '7px solid var(--mantine-color-gray-7)' }
                            : { borderRight: '7px solid var(--mantine-color-oklch-blue-6)' }
                        }
                        date={formatDistanceToNow(new Date(meeting.scheduleMeetingDate), { addSuffix: true })}
                        iconStyle={isPast
                            ? { background: 'var(--mantine-color-gray-7)', color: '#fff' }
                            : { background: 'var(--mantine-color-oklch-blue-6)', color: '#fff' }
                        }
                        icon={<IconCalendarTime />}
                    >
                        <div>
                            <Group justify="space-between" mb="xs">
                                <Title order={4} c="white">
                                    Meeting with {meeting.clientName}
                                </Title>
                                <Badge
                                    variant="filled"
                                    color={isPast ? "gray" : "blue.3"}
                                    size="sm"
                                >
                                    {format(new Date(meeting.scheduleMeetingDate), 'EEEE d MMM, h:mm a')}

                                </Badge>
                            </Group>

                            <Text size="sm" mb="md">
                                {meeting.projectBudget}
                            </Text>

                            <Text size="sm" mb="md">
                                {meeting.projectName}
                            </Text>

                            <Text size="sm" mb="lg">
                                {meeting.projectDescription.length > 100
                                    ? `${meeting.projectDescription.substring(0, 100)}...`
                                    : meeting.projectDescription
                                }
                            </Text>

                            <Group justify="space-between" mt="md">
                                <Text
                                    component={Link}
                                    href={`/emails?email=${encodeURIComponent(meeting.clientEmail)}&subject=${encodeURIComponent(`Re: Meeting about ${meeting.projectName}`)}`}
                                    c="white"
                                    td="underline"
                                    size="sm"
                                >
                                    Respond via Email →
                                </Text>
                                <Text
                                    component={Link}
                                    href={`/meetings/${meeting.id}`}
                                    c="white"
                                    td="underline"
                                    size="sm"
                                >
                                    View Details →
                                </Text>
                            </Group>
                        </div>
                    </VerticalTimelineElement>
                );
            })}

            <VerticalTimelineElement
                iconStyle={{ background: 'var(--mantine-color-green-6)', color: '#fff' }}
                icon={<IconCalendarTime />}
            />
        </VerticalTimeline>
    );
}