'use client';

import { Textarea, notifications } from '@repo/ui/components/mantine';
import { useCallback, useState } from 'react';
import type { ProfileData } from '../../_actions/types';
import { updateProfile } from '../../_actions/updateProfile';

interface DescriptionInputProps {
    initialValue: string;
    className?: string;
    onUpdate: (updatedProfile: Partial<ProfileData>) => void;
}

export function DescriptionInput({ initialValue, className, onUpdate }: DescriptionInputProps) {
    const [description, setDescription] = useState<string>(initialValue || '');
    const [isSaving, setIsSaving] = useState(false);

    // Handle description change
    const handleChange = useCallback(async (value: string) => {
        setDescription(value);

        try {
            setIsSaving(true);

            // Update local state immediately through parent component
            onUpdate({ description: value });

            // Save to database
            const result = await updateProfile({
                description: value
            });

            if (!result.success && result.error) {
                notifications.show({
                    title: 'Failed to update description',
                    message: result.error,
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Error updating description:', error);
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred while updating your description',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    }, [onUpdate]);

    return (
        <Textarea
            value={description}
            onChange={(e) => handleChange(e.currentTarget.value)}
            classNames={{ input: className }}
            variant="unstyled"
            autosize
            minRows={2}
            c="dimmed"
            size="sm"
            placeholder="Write a short description about yourself"
            styles={{ input: { textAlign: 'center' } }}
            disabled={isSaving}
        />
    );
}