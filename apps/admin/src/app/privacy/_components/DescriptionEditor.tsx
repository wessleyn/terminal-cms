'use client';

import { Button, Card, Group, Text, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback, useState } from 'react';
import { updatePrivacyDescription } from '../_actions/updatePrivacyDetails';
import { PrivacyType } from '../_types/types';

interface DescriptionEditorProps {
    initialDesc: string;
    privacyType: PrivacyType;
}

export default function DescriptionEditor({ initialDesc, privacyType }: DescriptionEditorProps) {
    const [description, setDescription] = useState(initialDesc);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const result = await updatePrivacyDescription(privacyType, description);

            if (result.success) {
                setIsEditing(false);
                notifications.show({
                    title: 'Success',
                    message: 'Description updated successfully',
                    color: 'green',
                });
            } else {
                notifications.show({
                    title: 'Error',
                    message: result.error || 'Failed to update description',
                    color: 'red',
                });
            }
        } catch (error) {
            console.error(error);
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    }, [description, privacyType]);

    return (
        <Card withBorder p="md" radius="md" mb="xl">
            <Text fw={500} mb="md">Policy Description</Text>

            {isEditing ? (
                <>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        minRows={3}
                        autosize
                        mb="md"
                        variant="unstyled"
                        placeholder="Enter a description for this privacy policy..."
                    />
                    <Group justify="flex-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDescription(initialDesc);
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            loading={isSaving}
                            variant="filled"
                            color="green.9"
                        >
                            Save
                        </Button>
                    </Group>
                </>
            ) : (
                <>
                    <Textarea
                        value={description}
                        readOnly
                        cols={3}
                        mb="md"
                        variant="unstyled"
                    />
                    <Group justify="flex-end">
                        <Button
                            onClick={() => setIsEditing(true)}
                            variant="filled"
                            color="green.8"
                        >
                            Edit Description
                        </Button>
                    </Group>
                </>
            )}
        </Card>
    );
}
