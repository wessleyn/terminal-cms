'use client';

import dynamic from 'next/dynamic';
import { ProfileData } from '../../_actions/fetchProfile';
import ProfileInfoSkeleton from './ProfileInfoSkeleton';

// Dynamically import the ProfileInfo component
const ProfileInfo = dynamic(() => import('./index'), {
    loading: () => <ProfileInfoSkeleton />,
    ssr: true,
});

interface ProfileInfoWrapperProps {
    profile: ProfileData | null;
}

export default function ProfileInfoWrapper({ profile }: ProfileInfoWrapperProps) {
    return <ProfileInfo profile={profile} />;
}
