'use client';

import { Alert, Center, Loader } from '@repo/ui/components/mantine';
import { useState } from 'react';
import { ProfileData } from '../_actions/types';
import ProfileEditor from './ProfileEditor';

interface ProfileEditorWrapperProps {
    initialProfile: ProfileData | null;
    initialError: string | null;
}

export default function ProfileEditorWrapper({
    initialProfile,
    initialError
}: ProfileEditorWrapperProps) {
    const [profile, setProfile] = useState<ProfileData | null>(initialProfile);
    const [error, setError] = useState<string | null>(initialError);
    const [loading, setLoading] = useState<boolean>(!initialProfile && !initialError);

    // Handle profile updates from child components
    const handleProfileUpdate = (updatedProfile: ProfileData) => {
        setProfile(updatedProfile);
    };

    if (loading) {
        return (
            <Center py="xl">
                <Loader size="lg" />
            </Center>
        );
    }

    if (error) {
        return (
            <Alert color="red" title="Error" mb="lg">
                {error}
            </Alert>
        );
    }

    if (!profile) {
        return (
            <Alert color="yellow" title="No Profile" mb="lg">
                No profile data found. Please try again later.
            </Alert>
        );
    }

    return <ProfileEditor profile={profile} onUpdate={handleProfileUpdate} />;
}