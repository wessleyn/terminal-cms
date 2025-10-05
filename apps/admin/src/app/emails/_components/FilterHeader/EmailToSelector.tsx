'use client'

import { Avatar, Button, Combobox, Flex, useCombobox } from "@mantine/core"
import { IconChevronDown } from '@tabler/icons-react'
import { useState } from 'react'

// Sample data for recipients
const recipients = [
    { value: 'me', label: 'Me', avatar: 'm', color: 'blue' },
    { value: 'team', label: 'My Team', avatar: 't', color: 'green' },
    { value: 'wessleynyakaz@gmail.com', label: 'wessley nyakanyanga', avatar: 'w', color: 'cyan' },
    { value: 'wnyakanyanga@outlook.com', label: 'wnyakanyanga@outlook.com', avatar: 'w', color: 'violet' },
    { value: 'hr@getbucksbank.com', label: 'hr@getbucksbank.com', avatar: 'h', color: 'orange' },
    { value: 'jobs@webzim.co.zw', label: 'jobs@webzim.co.zw', avatar: 'j', color: 'pink' },
]

interface EmailToSelectorProps {
    onChange?: (value: string | null) => void;
}

const EmailToSelector = ({ onChange }: EmailToSelectorProps) => {
    const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const filteredOptions = recipients.filter(
        (item) => item.label.toLowerCase().includes(search.toLowerCase()) ||
            item.value.toLowerCase().includes(search.toLowerCase())
    );

    const recipientOptions = filteredOptions.map((recipient) => (
        <Combobox.Option value={recipient.value} key={recipient.value}>
            <Flex gap="sm" align="center">
                <Avatar color={recipient.color} radius="xl" size="sm">
                    {recipient.avatar.toUpperCase()}
                </Avatar>
                <div style={{ overflow: 'hidden', width: '100%' }}>
                    <div style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {recipient.label}
                    </div>
                    {recipient.label !== recipient.value && !['me', 'team'].includes(recipient.value) && (
                        <div style={{ fontSize: '12px', color: 'gray', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {recipient.value}
                        </div>
                    )}
                </div>
            </Flex>
        </Combobox.Option>
    ));

    const handleOptionSubmit = (val: string) => {
        let newValue: string | null = val;

        if (val === 'clear') {
            newValue = null;
        }

        setSelectedRecipient(newValue);
        setSearch('');
        combobox.closeDropdown();

        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <Combobox
            store={combobox}
            withinPortal={true}
            width={300}
            onOptionSubmit={handleOptionSubmit}
        >
            <Combobox.Target>
                <Button
                    variant="default"
                    rightSection={<IconChevronDown size={16} />}
                    radius="sm"
                    px="md"
                    onClick={() => combobox.toggleDropdown()}
                >
                    {selectedRecipient ?
                        selectedRecipient === 'all' ? 'Anyone' :
                            selectedRecipient === 'me' ? 'Me' :
                                selectedRecipient === 'team' ? 'My Team' :
                                    recipients.find(r => r.value === selectedRecipient)?.label.split('@')[0] || 'To'
                        : 'To'}
                </Button>
            </Combobox.Target>

            <Combobox.Dropdown style={{ minWidth: '300px' }}>
                <Combobox.Search
                    placeholder="Search recipients..."
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    style={{ width: '100%' }}
                />
                <Combobox.Options>
                    {selectedRecipient && (
                        <Combobox.Option value="clear" style={{ fontWeight: 'bold' }}>
                            Clear selection
                        </Combobox.Option>
                    )}
                    <Combobox.Option value="all">Anyone</Combobox.Option>
                    <Combobox.Option value="me">Me</Combobox.Option>
                    <Combobox.Option value="notme">Not Me</Combobox.Option>
                    {recipientOptions.length > 0 ? (
                        recipientOptions
                    ) : (
                        <Combobox.Empty>No recipients found</Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}

export default EmailToSelector