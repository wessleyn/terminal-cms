'use client'

import { Checkbox, Flex, Menu, Tooltip } from "@mantine/core";
import { IconCaretDownFilled } from "@tabler/icons-react";
import { FetchedMail } from "../../_actions/fetchAllMails";

interface SelectionMenuProps {
    checked: boolean;
    userIsSelecting: boolean;
    emails: FetchedMail[];
    setSelectedEmails: (emails: string[]) => void;
    setChecked: (checked: boolean) => void;
    setFilteredEmails: (emails: FetchedMail[]) => void;
}

const SelectionMenu = ({
    checked,
    userIsSelecting,
    emails,
    setSelectedEmails,
    setChecked,
    setFilteredEmails
}: SelectionMenuProps) => {

    const handleSelectAll = () => {
        const allEmailIds = emails.map(email => email.id);
        setSelectedEmails(allEmailIds);
        setChecked(true);
        setFilteredEmails(emails);
    };

    const handleSelectNone = () => {
        setSelectedEmails([]);
        setChecked(false);
        setFilteredEmails(emails);
    };

    const handleSelectRead = () => {
        const readEmails = emails.filter(email => email.isRead);
        const readEmailIds = readEmails.map(email => email.id);
        setSelectedEmails(readEmailIds);
        setChecked(readEmailIds.length > 0);
        setFilteredEmails(readEmails);
    };

    const handleSelectUnread = () => {
        const unreadEmails = emails.filter(email => !email.isRead);
        const unreadEmailIds = unreadEmails.map(email => email.id);
        setSelectedEmails(unreadEmailIds);
        setChecked(unreadEmailIds.length > 0);
        setFilteredEmails(unreadEmails);
    };

    const handleSelectStarred = () => {
        const starredEmails = emails.filter(email => email.isStarred);
        const starredEmailIds = starredEmails.map(email => email.id);
        setSelectedEmails(starredEmailIds);
        setChecked(starredEmailIds.length > 0);
        setFilteredEmails(starredEmails);
    };

    const handleSelectUnstarred = () => {
        const unstarredEmails = emails.filter(email => !email.isStarred);
        const unstarredEmailIds = unstarredEmails.map(email => email.id);
        setSelectedEmails(unstarredEmailIds);
        setChecked(unstarredEmailIds.length > 0);
        setFilteredEmails(unstarredEmails);
    };

    return (
        <Tooltip label="Select emails" withArrow position="bottom-start">
            <Flex justify={'center'} align={'center'} gap={'xs'}>
                <Checkbox
                    variant="outline"
                    checked={checked}
                    indeterminate={userIsSelecting}
                    onChange={() => {
                        const newCheckedState = !checked;
                        setChecked(newCheckedState);
                        if (newCheckedState) {
                            setSelectedEmails(emails.map(email => email.id));
                        } else {
                            setSelectedEmails([]);
                        }
                    }}
                />
                <Menu>
                    <Menu.Target>
                        <Flex justify={'center'} align={'center'}>
                            <IconCaretDownFilled color="gray" size={16} />
                        </Flex>
                    </Menu.Target>
                    <Menu.Dropdown style={{
                        marginRight: '2rem'
                    }}>
                        <Menu.Item onClick={handleSelectAll}>All</Menu.Item>
                        <Menu.Item onClick={handleSelectNone}>None</Menu.Item>
                        <Menu.Item onClick={handleSelectRead}>Read</Menu.Item>
                        <Menu.Item onClick={handleSelectUnread}>Unread</Menu.Item>
                        <Menu.Item onClick={handleSelectStarred}>Starred</Menu.Item>
                        <Menu.Item onClick={handleSelectUnstarred}>UnStarred</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Flex>
        </Tooltip>
    );
};

export default SelectionMenu;