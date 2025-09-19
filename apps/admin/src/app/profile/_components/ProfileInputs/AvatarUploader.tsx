'use client';

import { Carousel } from '@mantine/carousel';
import {
    ActionIcon,
    Avatar,
    Badge,
    Group,
    Image,
    Stack,
    Text
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconChevronLeft, IconChevronRight, IconPlus, IconTrash, IconUpload } from '@tabler/icons-react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
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
    carouselImageClassName?: string;
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
    carouselImageClassName,
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

    // Update activeIndex when currentAvatarIndex changes from props
    // Add 1 to the index because index 0 is reserved for the upload slide
    useEffect(() => {
        setActiveIndex(currentAvatarIndex + 1);
    }, [currentAvatarIndex]);

    // Use activeIndex for UI display and only sync to server when needed
    // When activeIndex is 0, we're on the upload slide, so we don't have an avatar URL
    const activeAvatarUrl = activeIndex > 0 && avatars.length > 0 && activeIndex - 1 < avatars.length
        ? avatars[activeIndex - 1]?.url || ''
        : '';

    // Handler for successful Cloudinary upload
    const handleCloudinaryUpload = async (results: CloudinaryUploadWidgetResults) => {
        console.log('Cloudinary upload results:', results);
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
            console.log('Prisma Upload result:', uploadResult);

            if (uploadResult.success) {
                // Mark all existing avatars as not new
                const updatedAvatars = avatars.map(avatar => ({
                    ...avatar,
                    isNew: false
                }));

                // Add the new avatar to the list with isNew = true and ensure publicId is saved
                const newAvatar = {
                    id: uploadResult.avatarId || public_id,
                    url: uploadResult.url || secure_url,
                    publicId: public_id,
                    isNew: true
                };

                const newAvatars = [...updatedAvatars, newAvatar];
                const newIndex = newAvatars.length - 1; // Index of the newly added avatar

                // Update local state to include the new avatar and select it
                // Add 1 to the index for display because index 0 is the upload slide
                setActiveIndex(newIndex + 1);
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
        // Index is the position in the allSlides array
        // Real avatar index in the avatars array is index-1 (because index 0 is the upload slide)
        const avatarIndex = index - 1;

        // Don't do anything if the upload slide is selected
        if (index === 0) return;

        try {
            setIsSaving(true);
            // Update local state immediately for a responsive UI
            setActiveIndex(index);

            const result = await setCurrentAvatar(avatarIndex);

            if (result.success) {
                onUpdate({ currentAvatarIndex: avatarIndex });

                notifications.show({
                    title: 'Profile image updated',
                    message: 'Your profile image has been updated successfully',
                    color: 'green'
                });
            } else {
                // Revert to previous index on error
                setActiveIndex(currentAvatarIndex + 1); // +1 because our UI is offset
                notifications.show({
                    title: 'Update failed',
                    message: result.error || 'Failed to update profile image',
                    color: 'red'
                });
            }
        } catch {
            // Revert to previous index on error
            setActiveIndex(currentAvatarIndex + 1); // +1 because our UI is offset
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
        // Adjust index because we're dealing with the avatars array (no upload slide)
        const avatarIndex = index - 1;

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
            const avatar = avatars[avatarIndex];
            if (!avatar) {
                throw new Error('Avatar not found');
            }
            const avatarId = avatar.id;
            const result = await removeAvatar(avatarId);

            if (result.success) {
                const newAvatars = [...avatars];
                newAvatars.splice(avatarIndex, 1);

                // If the current avatar is removed, set the first image as the current avatar
                // Calculate new index client-side
                const newCurrentIndex = avatarIndex === currentAvatarIndex
                    ? 0
                    : currentAvatarIndex > avatarIndex
                        ? currentAvatarIndex - 1
                        : currentAvatarIndex;

                // Update both local state and profile state
                // Add 1 to the index for display because index 0 is the upload slide
                setActiveIndex(newCurrentIndex + 1);
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
        <div key="dropzone" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%'
        }}>
            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "terminal_portfolio"}
                options={{
                    maxFiles: 1,
                    resourceType: 'image',
                    clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                    maxFileSize: 3000000, // 3MB
                    showAdvancedOptions: false,
                    cropping: true,
                    multiple: false,
                    // CORS settings
                    showSkipCropButton: false,
                    showPoweredBy: false,
                    showUploadMoreButton: false,
                    croppingAspectRatio: 1,
                    croppingDefaultSelectionRatio: 0.8,
                    croppingShowDimensions: true,
                    croppingCoordinatesMode: 'custom',
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
                onSuccess={handleCloudinaryUpload}
                onError={(error) => {
                    console.error("Cloudinary upload error:", error);
                    notifications.show({
                        title: 'Upload Error',
                        message: 'Failed to connect to image upload service. Please try again.',
                        color: 'red'
                    });
                }}
            >
                {({ open }) => (
                    <div
                        onClick={() => open()}
                        className={uploadWidgetClassName}
                        style={{
                            width: '250px',
                            height: '250px',
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
        </div>,

        // Existing avatar slides with special styling for newly added ones
        ...avatars.map((avatar: ProfileAvatar, index: number) => (
            <div key={avatar.id} style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%'
            }}>
                <div
                    className={avatar.isNew ? 'avatar-new' : ''}
                    style={{
                        position: 'relative',
                        height: '250px',
                        width: '250px',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}
                >
                    <Image
                        src={avatar.url}
                        width="100%"
                        height="100%"
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
                <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 10
                }}>
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
        ))
    ];

    return (
        <div className={className} style={{ width: '100%' }}>
            {/* Header with avatar and quick upload button */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar
                        src={activeAvatarUrl}
                        size="lg"
                        radius="xl"
                        bg={activeIndex === 0 ? "dark" : undefined}
                        color={activeIndex === 0 ? "gray" : undefined}
                    >
                        {activeIndex === 0 && <IconPlus size={20} />}
                    </Avatar>
                    <Text size="sm" fw={500}>
                        {activeIndex === 0 ? 'Upload new image' : `Image ${activeIndex} selected`}
                    </Text>
                </div>

                {/* Quick upload button */}
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "terminal_portfolio"}
                    options={{
                        maxFiles: 1,
                        sources: ['local', 'camera'],
                        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                        maxFileSize: 3000000, // 3MB
                        showAdvancedOptions: false,
                        cropping: true,
                        multiple: false
                    }}
                    onUpload={handleCloudinaryUpload}
                    onError={(error) => {
                        console.error("Cloudinary upload error:", error);
                        notifications.show({
                            title: 'Upload Error',
                            message: 'Failed to connect to image upload service. Please try again.',
                            color: 'red'
                        });
                    }}
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

            <Carousel
                withIndicators
                loop
                withControls={false}        // Hide native controls since we have our own
                slideSize="100%"            // Each slide takes 100% of the carousel width
                height={300}                // Match the height of our images
                slideGap={0}                // No gap between slides
                align="center"              // Center the active slide
                slidesToScroll={1}          // Scroll 1 at a time
                initialSlide={activeIndex}  // Set initial slide from state
                onSlideChange={setActiveIndex} // Update active index when slides change
                styles={{
                    root: {
                        width: '100%',
                        overflow: 'hidden'
                    },
                    viewport: {
                        overflow: 'hidden'
                    },
                    container: {
                        display: 'flex',
                        flexDirection: 'row'
                    },
                    controls: {
                        padding: '0 8px'
                    }
                }}
                classNames={{
                    root: carouselClassName,
                    controls: carouselControlsClassName,
                    indicator: carouselIndicatorClassName,
                }}
            >
                {allSlides.map((slide, index) => (
                    <Carousel.Slide key={index}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginLeft: "0.5rem",
                            height: '100%'
                        }}>
                            {slide}
                        </div>
                    </Carousel.Slide>
                ))}
            </Carousel>

            {/* Manual carousel controller centered above profile fields */}
            <Group justify="center" mt={16} mb={16}>
                <ActionIcon
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="xl"
                    onClick={() => {
                        const newIndex = activeIndex === 0 ? allSlides.length - 1 : activeIndex - 1;
                        setActiveIndex(newIndex);
                    }}
                >
                    <IconChevronLeft size={20} />
                </ActionIcon>

                <Text size="sm" fw={500} mx={10}>
                    {activeIndex === 0 ? 'Upload' : `Image ${activeIndex}`} / {allSlides.length}
                </Text>

                <ActionIcon
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="xl"
                    onClick={() => {
                        const newIndex = (activeIndex + 1) % allSlides.length;
                        setActiveIndex(newIndex);
                    }}
                >
                    <IconChevronRight size={20} />
                </ActionIcon>
            </Group>

            {/* Status indicator */}
            {isSaving && (
                <Text size="sm" ta="center" c="dimmed" mt="md">
                    Saving changes...
                </Text>
            )}
        </div>
    );
}