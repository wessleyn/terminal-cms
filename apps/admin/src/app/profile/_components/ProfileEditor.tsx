'use client';

import {
    Card,
    Divider,
    Group,
    Stack,
    Text
} from '@mantine/core';
import { useCallback, useState } from 'react';
import type { ProfileData } from '../_actions/types';
import { DraggableSocialLinks } from './DraggableSocialLinks';
import classes from './ProfileEditor.module.css';
import { AvatarUploader } from './ProfileInputs/AvatarUploader';
import { DescriptionInput } from './ProfileInputs/DescriptionInput';
import { DisplayNameInput } from './ProfileInputs/DisplayNameInput';
import { TaglineInput } from './ProfileInputs/TaglineInput';


interface ProfileEditorProps {
    profile: ProfileData;
    onUpdate: (profile: ProfileData) => void;
}

export default function ProfileEditor({ profile: initialProfile, onUpdate }: ProfileEditorProps) {
    const [profile, setProfile] = useState<ProfileData>(initialProfile);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Central handler for all profile updates
    const handleProfileUpdate = useCallback((updateData: Partial<ProfileData>) => {
        const updatedProfile = {
            ...profile,
            ...updateData
        };

        setProfile(updatedProfile);
        onUpdate(updatedProfile);
        setLastSaved(new Date());
    }, [profile, onUpdate]);

    return (
        <Stack gap="lg">
            {/* Avatar uploader with card-based carousel design */}
            <AvatarUploader
                avatars={profile.avatars || []}
                currentAvatarIndex={profile.currentAvatarIndex || 0}
                onUpdate={handleProfileUpdate}
            />

            {/* Profile information card */}
            <Card radius="md" withBorder padding="xl" mx="auto" style={{ width: '100%', maxWidth: '900px' }}>
                {/* Display name section */}
                <DisplayNameInput
                    initialValue={profile.displayName || ''}
                    className={classes.editableField}
                    onUpdate={handleProfileUpdate}
                />

                {/* Tagline */}
                <TaglineInput
                    initialValue={profile.tagline || ''}
                    className={classes.editableField}
                    onUpdate={handleProfileUpdate}
                />

                {/* Description */}
                <DescriptionInput
                    initialValue={profile.bio || ''}
                    className={classes.editableField}
                    onUpdate={handleProfileUpdate}
                />

                <Divider my="md" />

                {/* Social links section */}
                <DraggableSocialLinks initialLinks={profile.socialLinks} />

                <Group justify="flex-end" mt={24}>
                    {lastSaved && (
                        <Text size="sm" c="dimmed">Last saved: {lastSaved.toLocaleTimeString()}</Text>
                    )}
                </Group>
            </Card>
        </Stack>
    );
}