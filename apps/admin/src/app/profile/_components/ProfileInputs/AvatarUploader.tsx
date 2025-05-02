'use client';

import { CldUploadWidget } from '@repo/ui/components/cloudinary';
import {
    ActionIcon,
    Avatar,
    Badge,
    Carousel,
    IconCheck,
    IconPlus,
    IconTrash,
    IconUpload,
    Image,
    Stack,
    Text,
    notifications
} from '@repo/ui/components/mantine';
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { removeAvatar } from '../../_actions/removeAvatar';
import { saveUploadedAvatar } from '../../_actions/saveUploadedAvatar';
import { setCurrentAvatar } from '../../_actions/setCurrentAvatar';
import type { ProfileAvatar, ProfileData } from '../../_actions/types';

interface AvatarUploaderProps {
    avatars: ProfileAvatar[];
    currentAvatarIndex: number;
    className?: string;
    carouselClassName?: string;
    carouselControlsClassName?: string;
    carouselIndicatorClassName?: string;
    imageContainerClassName?: string;
    carouselImageClassName?: string;
    imageOverlayClassName?: string;
    uploadWidgetClassName?: string;
    onUpdate: (updatedProfile: Partial<ProfileData>) => void;
}

// Add CSS for the glowing effect
const newAvatarStyles = `
  @keyframes glowPulse {
    0% { box-shadow: 0 0 5px 2px rgba(72, 187, 120, 0.5); }
    50% { box-shadow: 0 0 10px 5px rgba(72, 187, 120, 0.7); }
    100% { box-shadow: 0 0 5px 2px rgba(72, 187, 120, 0.5); }
  }

  .avatar-new {
    position: relative;
    border-radius: 8px;
    animation: glowPulse 2s infinite;
    border: 2px solid rgb(72, 187, 120);
  }
`;

export function AvatarUploader({
    avatars = [],
    currentAvatarIndex = 0,
    className,
    carouselClassName,
    carouselControlsClassName,
    carouselIndicatorClassName,
    imageContainerClassName,
    carouselImageClassName,
    imageOverlayClassName,
    uploadWidgetClassName,
    onUpdate
}: AvatarUploaderProps) {
    const [activeIndex, setActiveIndex] = useState<number>(currentAvatarIndex);
    const [isSaving, setIsSaving] = useState(false);

    // Add effect to inject the CSS for glowing effect
    useEffect(() => {
        // Create style element
        const styleElement = document.createElement('style');
        styleElement.textContent = newAvatarStyles;

        // Add it to head
        document.head.appendChild(styleElement);

        // Clean up on unmount
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    // Use activeIndex for UI display and only sync to server when needed
    const activeAvatarUrl = avatars.length > 0 && avatars[activeIndex]
        ? avatars[activeIndex].url
        : '';

    // Handler for successful Cloudinary upload
    const handleCloudinaryUpload = async (results: CloudinaryUploadWidgetResults) => {
        // Early return if not a successful upload or if info is missing
        if (results.event !== 'success' || !results.info) return;

        // Type guard to ensure info is the correct shape with public_id and secure_url
        if (typeof results.info === 'string' || !('public_id' in results.info) || !('secure_url' in results.info)) {
            console.error('Invalid upload result format', results);
            notifications.show({
                title: 'Upload failed',
                message: 'Invalid response from image server',
                color: 'red'
            });
            return;
        }

        try {
            setIsSaving(true);

            const { public_id, secure_url } = results.info;

            // Call the server action to save the upload
            const uploadResult = await saveUploadedAvatar(public_id, secure_url);

            if (uploadResult.success) {
                // Mark all existing avatars as not new
                const updatedAvatars = avatars.map(avatar => ({
                    ...avatar,
                    isNew: false
                }));

                // Add the new avatar to the list with isNew = true
                const newAvatar = {
                    id: uploadResult.avatarId || public_id,
                    url: uploadResult.url || secure_url,
                    publicId: public_id,
                    isNew: true
                };

                const newAvatars = [...updatedAvatars, newAvatar];
                const newIndex = newAvatars.length - 1; // Index of the newly added avatar

                // Update local state to include the new avatar and select it
                setActiveIndex(newIndex);
                onUpdate({
                    avatars: newAvatars,
                    currentAvatarIndex: newIndex
                });

                notifications.show({
                    title: 'Upload successful',
                    message: 'Your new profile image has been uploaded',
                    color: 'green'
                });
            } else {
                notifications.show({
                    title: 'Upload failed',
                    message: uploadResult.error || 'Failed to process image',
                    color: 'red'
                });
            }
        } catch (error) {
            console.error('Error processing upload:', error);
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle avatar selection
    const handleAvatarSelect = async (index: number) => {
        try {
            setIsSaving(true);
            // Update local state immediately for a responsive UI
            setActiveIndex(index);

            const result = await setCurrentAvatar(index);

            if (result.success) {
                onUpdate({ currentAvatarIndex: index });

                notifications.show({
                    title: 'Profile image updated',
                    message: 'Your profile image has been updated successfully',
                    color: 'green'
                });
            } else {
                // Revert to previous index on error
                setActiveIndex(currentAvatarIndex);
                notifications.show({
                    title: 'Update failed',
                    message: result.error || 'Failed to update profile image',
                    color: 'red'
                });
            }
        } catch {
            // Revert to previous index on error
            setActiveIndex(currentAvatarIndex);
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Handle avatar removal
    const handleAvatarRemove = async (index: number) => {
        if (!avatars || avatars.length <= 1) {
            notifications.show({
                title: 'Cannot remove',
                message: 'You need to have at least one profile image',
                color: 'red'
            });
            return;
        }

        try {
            setIsSaving(true);
            const avatar = avatars[index];
            if (!avatar) {
                throw new Error('Avatar not found');
            }
            const avatarId = avatar.id;
            const result = await removeAvatar(avatarId);

            if (result.success) {
                const newAvatars = [...avatars];
                newAvatars.splice(index, 1);

                // If the current avatar is removed, set the first image as the current avatar
                // Calculate new index client-side
                const newCurrentIndex = index === activeIndex
                    ? 0
                    : activeIndex > index
                        ? activeIndex - 1
                        : activeIndex;

                // Update both local state and profile state
                setActiveIndex(newCurrentIndex);
                onUpdate({
                    avatars: newAvatars,
                    currentAvatarIndex: newCurrentIndex
                });

                notifications.show({
                    title: 'Image removed',
                    message: 'Profile image has been removed successfully',
                    color: 'green'
                });
            } else {
                notifications.show({
                    title: 'Update failed',
                    message: result.error || 'Failed to remove profile image',
                    color: 'red'
                });
            }
        } catch {
            notifications.show({
                title: 'Error',
                message: 'An unexpected error occurred',
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Generate avatar slides for carousel with Cloudinary upload widget as first slide
    const allSlides = [
        // Cloudinary Upload Widget slide as the first slide
        <Carousel.Slide key="dropzone">
            <div className={imageContainerClassName}>
                <CldUploadWidget
                    uploadPreset="terminal_portfolio"
                    options={{
                        maxFiles: 1,
                        sources: ['local', 'url', 'camera'],
                        resourceType: 'image',
                        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                        maxFileSize: 3000000, // 3MB
                        styles: {
                            palette: {
                                window: '#000000',
                                windowBorder: '#333333',
                                tabIcon: '#FFFFFF',
                                menuIcons: '#CCCCCC',
                                textDark: '#FFFFFF',
                                textLight: '#333333',
                                link: '#0078FF',
                                action: '#4BB543',
                                inactiveTabIcon: '#999999',
                                error: '#FF5050',
                                inProgress: '#0078FF',
                                complete: '#4BB543',
                                sourceBg: '#222222'
                            }
                        }
                    }}
                    onUpload={handleCloudinaryUpload}
                >
                    {({ open }) => (
                        <div
                            onClick={() => open()}
                            className={uploadWidgetClassName}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '8px',
                                border: '2px dashed var(--mantine-color-blue-6)',
                                backgroundColor: 'var(--mantine-color-blue-0)',
                                cursor: 'pointer'
                            }}
                        >
                            <Stack align="center" justify="center" style={{ width: '100%', textAlign: 'center' }}>
                                <IconPlus size={40} stroke={1.5} />
                                <Text size="xl" ta="center" fw={500}>
                                    Add Profile Image
                                </Text>
                                <Text size="sm" c="dimmed" ta="center">
                                    Click to upload from your device
                                </Text>
                            </Stack>
                        </div>
                    )}
                </CldUploadWidget>
            </div>
        </Carousel.Slide>,

        // Existing avatar slides with special styling for newly added ones
        ...avatars.map((avatar: ProfileAvatar, index: number) => (
            <Carousel.Slide key={avatar.id}>
                <div className={imageContainerClassName}>
                    <div className={avatar.isNew ? 'avatar-new' : ''}>
                        <Image
                            src={avatar.url}
                            width={300}
                            height={300}
                            fit="cover"
                            className={carouselImageClassName}
                            alt="Profile Image Preview"
                        />
                        {avatar.isNew && (
                            <Badge
                                color="green"
                                variant="filled"
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    zIndex: 5
                                }}
                            >
                                New
                            </Badge>
                        )}
                    </div>
                    <div className={imageOverlayClassName}>
                        <ActionIcon
                            variant="filled"
                            color="blue"
                            onClick={() => handleAvatarSelect(index)}
                            radius="xl"
                            size="md"
                        >
                            <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon
                            variant="filled"
                            color="red"
                            onClick={() => handleAvatarRemove(index)}
                            radius="xl"
                            size="md"
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </div>
                </div>
            </Carousel.Slide>
        ))
    ];

    return (
        <div className={className}>
            {/* Fixed avatar for reference */}
            <Avatar
                src={activeAvatarUrl}
                size="lg"
                radius="xl"
            />

            <Carousel
                withIndicators
                loop
                slideSize="300px"
                height={300}
                slideGap="md"
                align="center"
                slidesToScroll={1}
                styles={{
                    viewport: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                }}
                classNames={{
                    root: carouselClassName,
                    controls: carouselControlsClassName,
                    indicator: carouselIndicatorClassName,
                }}
            >
                {allSlides}
            </Carousel>

            {/* Quick upload button */}
            <CldUploadWidget
                uploadPreset="terminal_portfolio"
                options={{
                    maxFiles: 1,
                    sources: ['local', 'camera'],
                    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                    maxFileSize: 3000000 // 3MB
                }}
                onUpload={handleCloudinaryUpload}
            >
                {({ open }) => (
                    <ActionIcon
                        onClick={() => open()}
                        variant="light"
                        color="blue"
                        size="md"
                        radius="xl"
                        disabled={isSaving}
                    >
                        <IconUpload size={16} />
                    </ActionIcon>
                )}
            </CldUploadWidget>
        </div>
    );
}