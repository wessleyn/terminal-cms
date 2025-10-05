
'use client'

import { Avatar, Box, Checkbox, Flex, Paper, Text } from "@mantine/core"
import { IconPaperclip, IconStar } from '@tabler/icons-react'
import { useState } from "react"

// Sample email data
const sampleEmails = [
    {
        id: 1,
        sender: "wessley nyakanyanga",
        email: "wessleynyakaz@gmail.com",
        subject: "Rar Archive Password - Fellow",
        preview: "",
        date: "Oct 2",
        avatar: "w",
        read: false,
        starred: true,
        hasAttachment: true
    },
    {
        id: 2,
        sender: "wnyakanyanga@outlook.com",
        email: "wnyakanyanga@outlook.com",
        subject: "Why do you need Freelance?",
        preview: "I'm interested in discussing the freelance opportunity you mentioned...",
        date: "Sep 30",
        avatar: "w",
        read: true,
        starred: false,
        hasAttachment: false
    },
    {
        id: 3,
        sender: "phibeonnyakanyanga@gmail.com",
        email: "phibeonnyakanyanga@gmail.com",
        subject: "20404-8AOCMD : Submission",
        preview: "Please find attached the submission for project 20404-8AOCMD...",
        date: "Sep 28",
        avatar: "p",
        read: true,
        starred: false,
        hasAttachment: true
    },
    {
        id: 4,
        sender: "wicknell@hotmail.com",
        email: "wicknell@hotmail.com",
        subject: "$300 Web Scraping Gig | Yancy Digital",
        preview: "Hello, I have a web scraping project that requires your expertise...",
        date: "Sep 25",
        avatar: "w",
        read: false,
        starred: true,
        hasAttachment: false
    },
    {
        id: 5,
        sender: "hr@getbucksbank.com",
        email: "hr@getbucksbank.com",
        subject: "Interview Invitation - Software Developer Position",
        preview: "Thank you for your application. We would like to invite you for an interview...",
        date: "Sep 23",
        avatar: "h",
        read: true,
        starred: false,
        hasAttachment: true
    },
    {
        id: 6,
        sender: "jobs@webzim.co.zw",
        email: "jobs@webzim.co.zw",
        subject: "Application Status Update",
        preview: "We're writing to update you on the status of your application...",
        date: "Sep 20",
        avatar: "j",
        read: true,
        starred: false,
        hasAttachment: false
    },
    {
        id: 7,
        sender: "recruitment@headhunters.co.zw",
        email: "recruitment@headhunters.co.zw",
        subject: "New Job Opportunity - Senior Developer",
        preview: "Based on your profile, we think you might be interested in this position...",
        date: "Sep 18",
        avatar: "r",
        read: false,
        starred: true,
        hasAttachment: true
    }
]

// Color map for avatars
const colorMap: Record<string, string> = {
    w: 'cyan',
    p: 'grape',
    h: 'orange',
    j: 'pink',
    r: 'violet'
}

const EmailList = () => {
    const [emails] = useState(sampleEmails)
    const [selectedEmails, setSelectedEmails] = useState<number[]>([])

    const toggleEmailSelection = (id: number) => {
        setSelectedEmails(prev =>
            prev.includes(id)
                ? prev.filter(emailId => emailId !== id)
                : [...prev, id]
        )
    }

    const handleEmailClick = (id: number) => {
        // This would typically navigate to the email detail view
        console.log(`Navigate to email ${id}`)
    }

    return (
        <Flex direction="column" gap="xs">
            {emails.map((email) => (
                <Flex
                    key={email.id}
                    align={'center'}
                    gap={8}
                >
                    <Checkbox
                        checked={selectedEmails.includes(email.id)}
                        onChange={() => toggleEmailSelection(email.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Select email"
                    />
                    <Paper
                        shadow="xs"
                        p="md"
                        w={'100%'}
                        withBorder={false}
                        onClick={() => handleEmailClick(email.id)}
                        style={{
                            cursor: 'pointer',
                            borderRadius: 8
                        }}
                        styles={{
                            root: {
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)'
                                }
                            }
                        }}
                    >
                        <Flex gap="md" align="center">
                            <Avatar
                                color={colorMap[email.avatar] || 'blue'}
                                radius="xl"
                                size="md"
                            >
                                {email.avatar.toUpperCase()}
                            </Avatar>
                            <Box style={{ flex: 1 }}>
                                <Flex align="center">
                                    <Box w={300} mr="md">
                                        <Text fw={email.read ? 100 : 900} size="sm" truncate>{email.sender}</Text>
                                    </Box>
                                    <Box style={{ flex: 1 }} mr="md">
                                        <Text size="sm" fw={email.read ? 100 : 900} truncate>{email.subject}</Text>
                                        <Flex align="center" gap="xs" mt={2}>
                                            {email.starred && (
                                                <IconStar size={14} fill="gold" color="gold" />
                                            )}
                                            {email.hasAttachment && (
                                                <IconPaperclip size={14} color="gray" />
                                            )}
                                            {email.preview && (
                                                <Text size="xs" c="dimmed" lineClamp={1}>
                                                    {email.preview}
                                                </Text>
                                            )}
                                        </Flex>
                                    </Box>
                                    <Box w={60} ta="right">
                                        <Text size="xs" c="dimmed">{email.date}</Text>
                                    </Box>
                                </Flex>
                            </Box>
                        </Flex>
                    </Paper>
                </Flex>
            ))}
        </Flex>
    )
}

export default EmailList