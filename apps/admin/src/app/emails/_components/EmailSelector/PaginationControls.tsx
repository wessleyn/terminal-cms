'use client'

import { Button, Group, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PaginationControlsProps {
    currentPage: number;
    totalEmails: number;
    itemsPerPage: number;
    setPage: (page: number) => void;
}

const PaginationControls = ({
    currentPage,
    totalEmails,
    itemsPerPage,
    setPage
}: PaginationControlsProps) => {
    const totalPages = Math.ceil(totalEmails / itemsPerPage);
    const startRange = (currentPage - 1) * itemsPerPage + 1;
    const endRange = Math.min(currentPage * itemsPerPage, totalEmails);

    return (
        <Group gap="xs">
            <Text size="sm" c="dimmed">
                {totalEmails > 0 ? `${startRange}-${endRange} of ${totalEmails}` : '0-0 of 0'}
            </Text>
            <Button
                variant="subtle"
                color="gray"
                size="compact-sm"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
            >
                <IconChevronLeft size={16} />
            </Button>
            <Button
                variant="subtle"
                color="gray"
                size="compact-sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
            >
                <IconChevronRight size={16} />
            </Button>
        </Group>
    );
};

export default PaginationControls;