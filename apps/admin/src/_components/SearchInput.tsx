'use client'

import { TextInput, TextInputProps } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const SearchInput = (props: TextInputProps) => {

    return (
        <TextInput
            radius="xl"
            size="md"
            placeholder="Search questions"
            rightSectionWidth={42}
            leftSection={<IconSearch size={18} stroke={1.5} />}
            {...props}
        />
    );
}

export default SearchInput;