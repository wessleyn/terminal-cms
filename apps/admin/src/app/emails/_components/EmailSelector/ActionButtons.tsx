'use client'

import { Button, Tooltip } from "@mantine/core";
import { IconArchive, IconShieldX, IconTrash } from "@tabler/icons-react";
import { FetchedMail } from "../../_actions/fetchAllMails";

interface ActionButtonsProps {
    selectedEmails: string[];
    emails: FetchedMail[];
    onAction: (action: string) => void;
}

const ActionButtons = ({ selectedEmails, onAction }: ActionButtonsProps) => {
    const hasSelectedEmails = selectedEmails.length > 0;

    return (
        <>
            <Tooltip label="Archive" withArrow position="bottom">
                <Button
                    variant="subtle"
                    color="gray"
                    disabled={!hasSelectedEmails}
                    onClick={() => onAction('archive')}
                >
                    <IconArchive size={18} />
                </Button>
            </Tooltip>
            <Tooltip label="Mark as spam" withArrow position="bottom">
                <Button
                    variant="subtle"
                    color="gray"
                    disabled={!hasSelectedEmails}
                    onClick={() => onAction('spam')}
                >
                    <IconShieldX size={18} />
                </Button>
            </Tooltip>
            <Tooltip label="Delete" withArrow position="bottom">
                <Button
                    variant="subtle"
                    color="gray"
                    disabled={!hasSelectedEmails}
                    onClick={() => onAction('delete')}
                >
                    <IconTrash size={18} />
                </Button>
            </Tooltip>
        </>
    );
};

export default ActionButtons;