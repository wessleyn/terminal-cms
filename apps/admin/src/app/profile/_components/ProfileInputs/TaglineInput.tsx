'use client';

import { TextInput, notifications } from '@repo/ui/components/mantine';
import { useCallback, useState } from 'react';
import type { ProfileData } from '../../_actions/types';
import { updateProfile } from '../../_actions/updateProfile';

interface TaglineInputProps {
    initialValue: string;
    className?: string;
    onUpdate: (updatedProfile: Partial<ProfileData>) => void;
}

export function TaglineInput({ initialValue, className, onUpdate }: TaglineInputProps) {
    const [tagline, setTagline] = useState<string>(initialValue || '');
    const [isSaving, setIsSaving] = useState(false);

    // Handle tagline change
    const handleChange = useCallback(async (value: string) => {
        setTagline(value);

        try {
            setIsSaving(true);

            // Update local state immediately through parent component
            onUpdate({ tagline: value });

            // Save to database
            const result = await updateProfile({
                tagline: value
            });

            if (!result.success && result.error) {
                notifications.show({
                    title: 'Failed to update tagline',
                    message: result.error,
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Error updating tagline:', error);
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred while updating your tagline',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    }, [onUpdate]);

    return (
        <TextInput
            value={tagline}
            onChange={(e) => handleChange(e.currentTarget.value)}
            classNames={{ input: className }}
            variant="unstyled"
            size="md"
            placeholder="Your professional tagline"
            styles={{ input: { textAlign: 'center' } }}
            disabled={isSaving}
        />
    );
}