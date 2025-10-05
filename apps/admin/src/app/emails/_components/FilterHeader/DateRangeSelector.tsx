'use client'

import { Button, Menu } from "@mantine/core";
import { IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

type DateRange = 'any' | 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'custom';

const dateRangeLabels: Record<DateRange, string> = {
    any: 'Any time',
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    lastWeek: 'Last week',
    thisMonth: 'This month',
    custom: 'Custom range'
};

interface DateRangeSelectorProps {
    onChange?: (value: DateRange) => void;
}

const DateRangeSelector = ({ onChange }: DateRangeSelectorProps) => {
    const [selectedRange, setSelectedRange] = useState<DateRange>('any');

    const handleRangeSelect = (range: DateRange) => {
        setSelectedRange(range);

        if (onChange) {
            onChange(range);
        }
    };

    return (
        <Menu shadow="md" width={200} position="bottom-start">
            <Menu.Target>
                <Button
                    variant="default"
                    rightSection={<IconChevronDown size={16} />}
                    radius="sm"
                    px="md"
                >
                    {dateRangeLabels[selectedRange]}
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item onClick={() => handleRangeSelect('any')}>
                    {dateRangeLabels.any}
                </Menu.Item>
                <Menu.Item onClick={() => handleRangeSelect('today')}>
                    {dateRangeLabels.today}
                </Menu.Item>
                <Menu.Item onClick={() => handleRangeSelect('yesterday')}>
                    {dateRangeLabels.yesterday}
                </Menu.Item>
                <Menu.Item onClick={() => handleRangeSelect('thisWeek')}>
                    {dateRangeLabels.thisWeek}
                </Menu.Item>
                <Menu.Item onClick={() => handleRangeSelect('lastWeek')}>
                    {dateRangeLabels.lastWeek}
                </Menu.Item>
                <Menu.Item onClick={() => handleRangeSelect('thisMonth')}>
                    {dateRangeLabels.thisMonth}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={() => handleRangeSelect('custom')}>
                    {dateRangeLabels.custom}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default DateRangeSelector;