import { Table, Text } from '@mantine/core';

export function EmptyState() {
    return (
        <Table.Tr>
            <Table.Td colSpan={5}>
                <Text ta="center" c="dimmed" py="lg">
                    No users found
                </Text>
            </Table.Td>
        </Table.Tr>
    );
}
