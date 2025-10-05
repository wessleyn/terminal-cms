'use client'

import { Button, Flex, Group } from "@mantine/core"
import { useState } from 'react'
import DateRangeSelector from './DateRangeSelector'
import EmailFromSelector from './EmailFromSelector'
import EmailToSelector from './EmailToSelector'

const FilterHeader = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fromFilter, setFromFilter] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [toFilter, setToFilter] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dateFilter, setDateFilter] = useState<string>('any');

    const handleFromChange = (value: string | null) => {
        setFromFilter(value);
    };

    const handleToChange = (value: string | null) => {
        setToFilter(value);
    };

    const handleDateChange = (value: string) => {
        setDateFilter(value);
    };

    return (
        <Flex direction="column" gap="md" w="100%" mb="lg">
            <Group gap="sm">
                <EmailFromSelector onChange={handleFromChange} />

                <DateRangeSelector onChange={handleDateChange} />

                <Button variant="default" radius="sm" px="md">
                    Has attachment
                </Button>

                <EmailToSelector onChange={handleToChange} />

                <Button variant="default" radius="sm" px="md">
                    Is unread
                </Button>

            </Group>
        </Flex>
    )
}

export default FilterHeader