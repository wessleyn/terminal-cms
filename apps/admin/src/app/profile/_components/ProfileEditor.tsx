'use client';

import {
    Card,
    Divider,
    Group,
    Stack,
    Text
} from '@repo/ui/components/mantine';
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
        <Card radius="md" withBorder padding="xl" mx="auto">
            {/* Fixed avatar and carousel */}
            <div className={classes.topRightAvatar}>
                <AvatarUploader
                    avatars={profile.avatars || []}
                    currentAvatarIndex={profile.currentAvatarIndex || 0}
                    carouselClassName={classes.carousel}
                    carouselControlsClassName={classes.carouselControls}
                    carouselIndicatorClassName={classes.carouselIndicator}
                    imageContainerClassName={classes.imageContainer}
                    carouselImageClassName={classes.carouselImage}
                    imageOverlayClassName={classes.imageOverlay}
                    uploadWidgetClassName={classes.uploadWidget}
                    onUpdate={handleProfileUpdate}
                />
            </div>

            <Card.Section>
                {/* The carousel is now managed by AvatarUploader */}
            </Card.Section>

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
                initialValue={profile.description || ''}
                className={classes.editableField}
                onUpdate={handleProfileUpdate}
            />

            <Stack mt="md" gap="xs">
                <Divider my="sm" />

                <DraggableSocialLinks initialLinks={profile.socialLinks} />
            </Stack>

            <Group justify="flex-end" mt={24}>
                {lastSaved && (
                    <Text size="sm" c="dimmed">Last saved: {lastSaved.toLocaleTimeString()}</Text>
                )}
            </Group>
        </Card>
    );
}