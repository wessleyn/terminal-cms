'use client';

import {
    Card,
    Flex,
    Grid,
    Group,
    Text,
    Title
} from '@mantine/core';
import {
    IconCalendar,
    IconClock,
    IconCoin,
    IconFileDescription,
    IconMail,
    IconUser
} from '@tabler/icons-react';
import { format } from 'date-fns';

interface MeetingDetailsProps {
    clientName: string;
    clientEmail: string;
    projectName: string;
    projectBudget: string;
    scheduleMeetingDate: Date;
    projectDescription?: string; // Added project description field
}

export function MeetingDetails({
    clientName,
    clientEmail,
    projectName,
    projectBudget,
    scheduleMeetingDate,
    projectDescription
}: MeetingDetailsProps) {
    return (
        <Grid gutter="md">
            {/* Left column with meeting details */}
            <Grid.Col span={{ base: 12, md: 6 }}>
                <Flex direction="column" gap="sm">
                    {/* Client Information */}
                    <Group align="flex-start" className="terminal-info-item">
                        <IconUser size={20} className="terminal-icon" style={{ flexShrink: 0 }} />
                        <Text className="terminal-value">{clientName}</Text>
                    </Group>

                    <Group align="flex-start" className="terminal-info-item">
                        <IconMail size={20} className="terminal-icon" style={{ flexShrink: 0 }} />
                        <Text
                            component="a"
                            href={`mailto:${clientEmail}`}
                            className="terminal-link"
                        >
                            {clientEmail}
                        </Text>
                    </Group>

                    {/* Project Information */}
                    <Group align="flex-start" className="terminal-info-item">
                        <IconFileDescription size={20} className="terminal-icon" style={{ flexShrink: 0 }} />
                        <Text className="terminal-value">{projectName}</Text>
                    </Group>

                    <Group align="flex-start" className="terminal-info-item">
                        <IconCoin size={20} className="terminal-icon" style={{ flexShrink: 0 }} />
                        <Text className="terminal-value">{projectBudget}</Text>
                    </Group>

                    {/* Meeting Schedule */}
                    <Group align="flex-start" className="terminal-info-item">
                        <IconCalendar size={20} className="terminal-icon" style={{ flexShrink: 0 }} />
                        <Text className="terminal-value">{format(new Date(scheduleMeetingDate), 'PPP')}</Text>
                    </Group>

                    <Group align="flex-start" className="terminal-info-item">
                        <IconClock size={20} className="terminal-icon" style={{ flexShrink: 0 }} />
                        <Text className="terminal-value">{format(new Date(scheduleMeetingDate), 'p')}</Text>
                    </Group>
                </Flex>
            </Grid.Col>

            {/* Right column with project description */}
            {projectDescription && (
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card p="md" radius="md" className="terminal-card" style={{ height: '100%' }}>
                        <Title order={5} mb="sm" className="terminal-heading">Project Description</Title>
                        <Text className="terminal-value">{projectDescription}</Text>
                    </Card>
                </Grid.Col>
            )}
        </Grid>
    );
}