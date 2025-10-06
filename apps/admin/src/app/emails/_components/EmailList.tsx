
'use client'

import { Avatar, Badge, Box, Checkbox, Flex, Paper, Text } from "@mantine/core"
import { IconPaperclip, IconStar } from '@tabler/icons-react'
import { useState } from "react"
import { FetchedMail } from "../_actions/fetchAllMails"


interface EmailListProps {
    fetchedMails: FetchedMail[]
    toggleEmailSelection: (id: string) => void
    selectedEmails: string[]
    showLabel?: boolean
}

const EmailList = ({ fetchedMails, toggleEmailSelection, selectedEmails, showLabel }: EmailListProps) => {
    const [emails] = useState(fetchedMails)

    const handleEmailClick = (id: string) => {
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
                                color={email.from.name ? 'blue' : 'gray'}
                                radius="xl"
                                size="md"
                            >
                                {((email.from.name?.[0] || email.from.email?.[0]) || '?').toUpperCase()}
                            </Avatar>
                            <Box style={{ flex: 1 }}>
                                <Flex align="center">
                                    <Box w={showLabel ? 200 : 300} mr="md">
                                        <Text fw={email.isRead ? 100 : 900} size="sm" truncate>{email.from.name || email.from.email}</Text>
                                    </Box>
                                    {
                                        showLabel && <Badge color="gray" style={{ marginRight: ".3rem"}} >{
                                            email.isArchived
                                                ? "Archived" :
                                                email.isSpam ? "Spam" :
                                                    email.isTrash ? "Trash" : "Inbox"
                                        }</Badge>
                                    }
                                    <Box style={{ flex: 1 }} mr="md">
                                        <Text size="sm" fw={email.isRead ? 100 : 900} truncate>{email.subject}</Text>
                                        <Flex align="center" gap="xs" mt={2}>
                                            {email.isStarred && (
                                                <IconStar size={14} fill="gold" color="gold" />
                                            )}
                                            {email.attachments.length > 0 && (
                                                <IconPaperclip size={14} color="gray" />
                                            )}
                                            {email.body && (
                                                <Text size="xs" c="dimmed" lineClamp={1}>
                                                    {email.bodyPreview ?? email.body.replace(/<[^>]+>/g, '').substring(0, 100)}
                                                </Text>
                                            )}
                                        </Flex>
                                    </Box>
                                    <Box w={60} ta="right">
                                        <Text size="xs" c="dimmed">{email.receivedAt!.toTimeString().substring(0, 9)}</Text>
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