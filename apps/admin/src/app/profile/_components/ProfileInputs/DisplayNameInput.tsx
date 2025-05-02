'use client';

import { TextInput, notifications } from '@repo/ui/components/mantine';
import { useCallback, useState } from 'react';
import type { ProfileData } from '../../_actions/types';
import { updateProfile } from '../../_actions/updateProfile';

interface DisplayNameInputProps {
    initialValue: string;
    className?: string;
    onUpdate: (updatedProfile: Partial<ProfileData>) => void;
}

export function DisplayNameInput({ initialValue, className, onUpdate }: DisplayNameInputProps) {
    const [displayName, setDisplayName] = useState<string>(initialValue || "Hello, I'm John Doe");
    const [isSaving, setIsSaving] = useState(false);

    // Handle displayName change
    const handleChange = useCallback(async (value: string) => {
        setDisplayName(value);

        try {
            setIsSaving(true);

            // Update local state immediately through parent component
            onUpdate({ displayName: value });

            // Save to database
            const result = await updateProfile({
                displayName: value
            });

            if (!result.success && result.error) {
                notifications.show({
                    title: 'Failed to update display name',
                    message: result.error,
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Error updating display name:', error);
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred while updating your display name',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    }, [onUpdate]);

    return (
        <TextInput
            value={displayName}
            onChange={(e) => handleChange(e.currentTarget.value)}
            variant="unstyled"
            size="lg"
            fw={500}
            placeholder="Your display name"
            styles={{ input: { textAlign: 'center' } }}
            className={className}
            disabled={isSaving}
        />
    );
}