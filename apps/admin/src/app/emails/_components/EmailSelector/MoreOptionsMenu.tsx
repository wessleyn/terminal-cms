'use client'

import { Menu, Tooltip, UnstyledButton } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";

interface MoreOptionsMenuProps {
    selectedEmails: string[];
    onAction: (action: string) => void;
}

const MoreOptionsMenu = ({ selectedEmails, onAction }: MoreOptionsMenuProps) => {
    const hasSelectedEmails = selectedEmails.length > 0;

    return (
        <Menu>
            <Menu.Target>
                <Tooltip label="More options" withArrow position="bottom">
                    <UnstyledButton
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <IconDotsVertical size={18} />
                    </UnstyledButton>
                </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    disabled={!hasSelectedEmails}
                    onClick={() => onAction('markRead')}
                >
                    Mark as read
                </Menu.Item>
                <Menu.Item
                    disabled={!hasSelectedEmails}
                    onClick={() => onAction('markUnread')}
                >
                    Mark as unread
                </Menu.Item>
                <Menu.Item
                    disabled={!hasSelectedEmails}
                    onClick={() => onAction('star')}
                >
                    Add star
                </Menu.Item>
                <Menu.Item
                    disabled={!hasSelectedEmails}
                    onClick={() => onAction('unstar')}
                >
                    Remove star
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    disabled={!hasSelectedEmails}
                    onClick={() => alert('Label functionality not implemented')}
                >
                    Add label
                </Menu.Item>
                <Menu.Item
                    disabled={!hasSelectedEmails}
                    onClick={() => alert('Label functionality not implemented')}
                >
                    Remove label
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default MoreOptionsMenu;