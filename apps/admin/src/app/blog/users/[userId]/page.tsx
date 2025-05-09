import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchUserDetails } from '../_actions/fetchUserDetails';
import UserProfileDetail from '../_components/UserProfileDetail';

interface UserPageProps {
    params: Promise<{
        userId: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
    const user = await fetchUserDetails((await params).userId);

    if (!user) {
        return {
            title: 'User Not Found',
        };
    }

    return {
        title: `${user.name || 'User'} - Admin Dashboard`,
        description: `Details for user ${user.name || 'User'}.`,
    };
}

export default async function UserPage({ params, searchParams }: UserPageProps) {
    const user = await fetchUserDetails((await params).userId);

    if (!user) {
        notFound();
    }

    // Check if edit mode is active from search parameters
    const isEditMode = (await searchParams).edit === 'true';

    return (
        <UserProfileDetail user={user} initialEditMode={isEditMode} />
    );
}