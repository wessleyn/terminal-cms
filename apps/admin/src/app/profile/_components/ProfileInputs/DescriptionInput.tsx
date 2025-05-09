'use client';

import { Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback, useState } from 'react';
import type { ProfileData } from '../../_actions/types';
import { updateProfile } from '../../_actions/updateProfile';

interface DescriptionInputProps {
    initialValue: string;
    className?: string;
    onUpdate: (updatedProfile: Partial<ProfileData>) => void;
}

export function DescriptionInput({ initialValue, className, onUpdate }: DescriptionInputProps) {
    const [bio, setBio] = useState<string>(initialValue || '');
    const [isSaving, setIsSaving] = useState(false);

    // Handle description change
    const handleChange = useCallback(async (value: string) => {
        setBio(value);

        try {
            setIsSaving(true);

            // Update local state immediately through parent component
            onUpdate({ bio: value });

            // Save to database
            const result = await updateProfile({
                bio: value
            });

            if (!result.success && result.error) {
                notifications.show({
                    title: 'Failed to update bio',
                    message: result.error,
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Error updating bio:', error);
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred while updating your bio',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    }, [onUpdate]);

    return (
        <Textarea
            value={bio}
            onChange={(e) => handleChange(e.currentTarget.value)}
            classNames={{ input: className }}
            variant="unstyled"
            autosize
            minRows={2}
            c="dimmed"
            size="sm"
            placeholder="Write a short bio about yourself"
            styles={{ input: { textAlign: 'center' } }}
            disabled={isSaving}
        />
    );
}