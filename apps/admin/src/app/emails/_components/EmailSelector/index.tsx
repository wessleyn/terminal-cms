'use client'

import { Flex, Space, Tooltip, UnstyledButton } from "@mantine/core";
import {
    IconFolderShare,
    IconMailOpened,
    IconRefresh
} from '@tabler/icons-react';
import { useState } from "react";
import { FetchedMail } from "../../_actions/fetchAllMails";
import updateMail from "../../_actions/updateMail";
import ActionButtons from "./ActionButtons";
import MoreOptionsMenu from "./MoreOptionsMenu";
import PaginationControls from "./PaginationControls";
import SelectionMenu from "./SelectionMenu";

interface Props {
    setSelectedEmails: (emails: string[]) => void;
    setFilteredEmails: (emails: FetchedMail[]) => void;
    selectedEmails: string[];
    emails: FetchedMail[];
}

const EmailSelector = ({ setSelectedEmails, selectedEmails, emails, setFilteredEmails }: Props) => {
    const [checked, setChecked] = useState(false);

    const userIsSelecting = !checked && selectedEmails.length > 0

    const handleAction = async (action: string) => {
        const selMails = emails.filter(email => selectedEmails.includes(email.id));

        const updatedEmails = selMails.map(mail => {
            switch (action) {
                case 'archive':
                    return { ...mail, isArchived: true };
                case 'unarchive':
                    return { ...mail, isArchived: false };
                case 'spam':
                    return { ...mail, isSpam: true };
                case 'delete':
                    return { ...mail, isTrash: true };
                case 'markRead':
                    return { ...mail, isRead: true };
                case 'markUnread':
                    return { ...mail, isRead: false };
                case 'star':
                    return { ...mail, isStarred: true };
                case 'unstar':
                    return { ...mail, isStarred: false };
                default:
                    console.log(`Action ${action} not implemented yet`);
                    return mail;
            }
        });
    updatedEmails.forEach(console.log)

        setFilteredEmails(updatedEmails);
        setSelectedEmails([]);
        await Promise.all(updatedEmails.map(mail =>
            updateMail({
                id: mail.id,
                isArchived: mail.isArchived,
                isTrash: mail.isTrash,
                isRead: mail.isRead,
                isStarred: mail.isStarred,
                isSpam: mail.isSpam
            })
        ));

    };


    return (
        <Flex gap='lg' w={'100%'} justify={'space-between'} >
            <Flex gap='lg' >
                <SelectionMenu
                    checked={checked}
                    userIsSelecting={userIsSelecting}
                    emails={emails}
                    setSelectedEmails={setSelectedEmails}
                    setChecked={setChecked}
                    setFilteredEmails={setFilteredEmails}
                />
                {
                    checked ? <Flex gap='lg'>
                        <ActionButtons
                            selectedEmails={selectedEmails}
                            emails={emails}
                            onAction={handleAction}
                        />
                        <Space w='lg' />
                        <Tooltip label="Mark as Read" withArrow position="bottom">
                            <UnstyledButton onClick={() => handleAction('markRead')}>
                                <IconMailOpened color="gray" size={22} />
                            </UnstyledButton>
                        </Tooltip>
                        <Tooltip label="Move to" withArrow position="bottom">
                            <UnstyledButton>
                                <IconFolderShare color="gray" size={22} />
                            </UnstyledButton>
                        </Tooltip>
                    </Flex>
                        :
                        <Tooltip label="Refresh" withArrow position="bottom">
                            <UnstyledButton onClick={() => {
                                setFilteredEmails(emails);
                                setSelectedEmails([]);
                                setChecked(false);
                            }}>
                                <IconRefresh color="gray" size={22} />
                            </UnstyledButton>
                        </Tooltip>
                }
                <MoreOptionsMenu
                    selectedEmails={selectedEmails}
                    onAction={handleAction}
                />
            </Flex>
            <PaginationControls
                currentPage={1}
                totalEmails={emails.length}
                itemsPerPage={8}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                setPage={function (_page: number): void {
                    alert("Function not implemented.");
                }} />
        </Flex>
    )
}

export default EmailSelector