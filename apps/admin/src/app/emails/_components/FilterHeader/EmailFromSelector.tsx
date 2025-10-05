'use client'

import { Avatar, Button, Combobox, Flex, useCombobox } from "@mantine/core"
import { IconChevronDown } from '@tabler/icons-react'
import { useState } from 'react'

// Sample data for past senders
const pastSenders = [
    { value: 'wessleynyakaz@gmail.com', label: 'wessley nyakanyanga', avatar: 'w', color: 'cyan' },
    { value: 'wnyakanyanga@outlook.com', label: 'wnyakanyanga@outlook.com', avatar: 'w', color: 'violet' },
    { value: 'phibeonnyakanyanga@gmail.com', label: 'phibeonnyakanyanga@gmail.com', avatar: 'p', color: 'grape' },
    { value: 'wicknell@hotmail.com', label: 'wicknell@hotmail.com', avatar: 'w', color: 'blue' },
    { value: 'hr@getbucksbank.com', label: 'hr@getbucksbank.com', avatar: 'h', color: 'orange' },
    { value: 'jobs@webzim.co.zw', label: 'jobs@webzim.co.zw', avatar: 'j', color: 'pink' },
    { value: 'recruitment@headhunters.co.zw', label: 'recruitment@headhunters.co.zw', avatar: 'r', color: 'violet' },
]

interface EmailFromSelectorProps {
    onChange?: (value: string | null) => void;
}

const EmailFromSelector = ({ onChange }: EmailFromSelectorProps) => {
    const [selectedSender, setSelectedSender] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const filteredOptions = pastSenders.filter(
        (item) => item.label.toLowerCase().includes(search.toLowerCase()) ||
            item.value.toLowerCase().includes(search.toLowerCase())
    );

    const senderOptions = filteredOptions.map((sender) => (
        <Combobox.Option value={sender.value} key={sender.value}>
            <Flex gap="sm" align="center">
                <Avatar color={sender.color} radius="xl" size="sm">
                    {sender.avatar.toUpperCase()}
                </Avatar>
                <div style={{ overflow: 'hidden', width: '100%' }}>
                    <div style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sender.label}
                    </div>
                    {sender.label !== sender.value && (
                        <div style={{ fontSize: '12px', color: 'gray', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {sender.value}
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

        setSelectedSender(newValue);
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
                    {selectedSender ?
                        selectedSender === 'all' ? 'All senders' :
                            pastSenders.find(sender => sender.value === selectedSender)?.label.split('@')[0] || 'From'
                        : 'From'}
                </Button>
            </Combobox.Target>

            <Combobox.Dropdown style={{ minWidth: '300px', marginLeft: "6.4rem" }}>
                <Combobox.Search
                    placeholder="Search senders..."
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    style={{ width: '100%' }}
                />
                <Combobox.Options>
                    {selectedSender && (
                        <Combobox.Option value="clear" style={{ fontWeight: 'bold' }}>
                            Clear selection
                        </Combobox.Option>
                    )}
                    <Combobox.Option value="all">All senders</Combobox.Option>
                    {senderOptions.length > 0 ? (
                        senderOptions
                    ) : (
                        <Combobox.Empty>No senders found</Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}

export default EmailFromSelector