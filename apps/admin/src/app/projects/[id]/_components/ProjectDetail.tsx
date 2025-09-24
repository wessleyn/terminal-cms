'use client';

import { Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ActivityStatus, HappyIndex, PublishStatus } from '@repo/db';
import TagInput from '@repo/ui/components/shared/TagInput';
import { IconPhoto, IconUpload } from '@tabler/icons-react';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { saveProjectImage } from '../../_actions/saveProjectImage';
import { newStatus, UpdateField, updateProject, updateProjectStatus } from '../../_actions/updateProject';
import ActivityStatusBadge from '../../_components/ActivityStatusBadge';
import HappyStatusBadge from '../../_components/HappyStatusBadge';
import PublishStatusBadge from '../../_components/PublishStatusBadge';
import '../_styles/projectGallery.css';

interface ProjectDetailProps {
    project: {
        id: string;
        title: string;
        description: string;
        imageUrl: string | null;
        tags: string[];
        githubUrl: string | null;
        liveUrl: string | null;
        engagement: {
            share: number;
            bookmark: number;
            like: number;
        } | null;
        publishStatus: PublishStatus;
        activityStatus: ActivityStatus;
        happyIndex: HappyIndex
        createdAt?: Date;
        updatedAt?: Date;
        featured?: boolean;
    };
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
    const router = useRouter();
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [imageUploadStatus, setImageUploadStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle');

    // State for editable fields
    const [editedTitle, setEditedTitle] = useState(project.title);
    const [editedDescription, setEditedDescription] = useState(project.description);
    const [editedImageUrl, setEditedImageUrl] = useState(project.imageUrl || '');
    const [editedTags, setEditedTags] = useState(project.tags || []);
    const [editedGithubUrl, setEditedGithubUrl] = useState(project.githubUrl || '');
    const [editedLiveUrl, setEditedLiveUrl] = useState(project.liveUrl || '');

    // State to track changes for the save button
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Store original values for comparison
    const originalValues = {
        title: project.title,
        description: project.description,
        imageUrl: project.imageUrl || '',
        tags: project.tags || [],
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || ''
    };

    // Function to check if any field has changed from original
    const checkForChanges = (fields = {
        title: editedTitle,
        description: editedDescription,
        imageUrl: editedImageUrl,
        tags: editedTags,
        githubUrl: editedGithubUrl,
        liveUrl: editedLiveUrl
    }) => {
        // Check for differences between current and original values
        const hasChanges =
            fields.title !== originalValues.title ||
            fields.description !== originalValues.description ||
            fields.imageUrl !== originalValues.imageUrl ||
            fields.githubUrl !== originalValues.githubUrl ||
            fields.liveUrl !== originalValues.liveUrl ||
            !arraysEqual(fields.tags, originalValues.tags);

        setHasUnsavedChanges(hasChanges);
    };

    // Helper function to compare arrays
    const arraysEqual = (a: string[], b: string[]) => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    // Handle saving all changes at once
    const handleSaveChanges = async () => {
        if (!hasUnsavedChanges) return;

        setSaveStatus('saving');

        try {
            // Construct the data object with the updated fields while maintaining the required structure
            const updateData = {
                title: editedTitle,
                description: editedDescription,
                imageUrl: editedImageUrl,
                tags: editedTags,
                githubUrl: editedGithubUrl,
                liveUrl: editedLiveUrl,
            };

            const result = await updateProject(project.id, updateData);

            if (!result.success) {
                throw new Error(result.error);
            }

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
            setHasUnsavedChanges(false);

            // Refresh the page to get updated data
            router.refresh();

        } catch (error) {
            console.error(`Error updating project:`, error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Update any field value and mark as having unsaved changes
    const updateField = (field: string, value: string | string[]) => {
        switch (field) {
            case 'title':
                setEditedTitle(value as string);
                checkForChanges({ ...originalValues, title: value as string });
                break;
            case 'description':
                setEditedDescription(value as string);
                checkForChanges({ ...originalValues, description: value as string });
                break;
            case 'imageUrl':
                setEditedImageUrl(value as string);
                checkForChanges({ ...originalValues, imageUrl: value as string });
                break;
            case 'tags':
                setEditedTags(value as string[]);
                checkForChanges({ ...originalValues, tags: value as string[] });
                break;
            case 'githubUrl':
                setEditedGithubUrl(value as string);
                checkForChanges({ ...originalValues, githubUrl: value as string });
                break;
            case 'liveUrl':
                setEditedLiveUrl(value as string);
                checkForChanges({ ...originalValues, liveUrl: value as string });
                break;
            default:
                return;
        }
    };

    const handleStatusChange = async (statusType: UpdateField, value: newStatus) => {
        setSaveStatus('saving');

        try {
            const result = await updateProjectStatus(
                project.id,
                statusType,
                value
            );

            if (!result.success) {
                throw new Error('Failed to update status');
            }

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);

            router.refresh();

        } catch (error) {
            console.error(`Error updating project status:`, error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Pre-defined tag suggestions
    const tagSuggestions = [
        'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js',
        'Express', 'MongoDB', 'PostgreSQL', 'CSS', 'Tailwind',
        'Redux', 'GraphQL', 'API', 'Authentication', 'Bootstrap',
        'Material UI', 'Firebase', 'AWS', 'Docker', 'CI/CD'
    ];

    const handleCloudinaryUpload = async (results: CloudinaryUploadWidgetResults) => {
        // Early return if not a successful upload or if info is missing
        if (results.event !== 'success' || !results.info) return;

        if (typeof results.info === 'string' || !('public_id' in results.info) || !('secure_url' in results.info)) {
            console.error('Invalid upload result format', results);
            setImageUploadStatus('error');
            return;
        }

        try {
            setImageUploadStatus('uploading');
            const { public_id, secure_url } = results.info;

            const result = await saveProjectImage(project.id, public_id, secure_url);

            if (result.success) {
                setEditedImageUrl(secure_url);
                setImageUploadStatus('uploaded');

                setTimeout(() => setImageUploadStatus('idle'), 2000);

                router.refresh();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving uploaded image:', error);
            setImageUploadStatus('error');
            setTimeout(() => setImageUploadStatus('idle'), 3000);
        }
    };

    useEffect(() => {
        try {
            new URL(editedImageUrl);
        } catch (error) {
            setEditedImageUrl("http://localhost:3000" + editedImageUrl);
            console.error('Error parsing image URL:', error);
        }

    }, [editedImageUrl])

    // Display image URL or fallback
    const displayImageUrl = editedImageUrl || '/assets/img/projects/project1.webp';

    return (
        <Box
            className="project-detail"
            data-project-id={project.id}
            style={{
                border: hasUnsavedChanges ? '2px solid rgba(255, 193, 7, 0.5)' : 'none',
                borderRadius: hasUnsavedChanges ? '8px' : '0',
                padding: hasUnsavedChanges ? '20px' : '0',
                transition: 'all 0.3s ease'
            }}
        >
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <Link href="/projects" className="btn btn-outline-primary terminal-btn">
                    <span className="terminal-prompt">$</span> cd ../dashboard/projects
                </Link>

                <div className="d-flex align-items-center gap-3">
                    <PublishStatusBadge
                        status={project.publishStatus}
                        onStatusChange={(status) => handleStatusChange('publishStatus', status)}
                    />
                    <HappyStatusBadge
                        status={project.happyIndex}
                        onStatusChange={(status) => handleStatusChange('happyIndex', status)}
                    />
                    <ActivityStatusBadge
                        status={project.activityStatus}
                        onStatusChange={(status) => handleStatusChange('activityStatus', status)}
                    />
                </div>
            </div>

            <div className="save-status mb-3">
                {saveStatus === 'saving' && <span className="text-info">Saving changes...</span>}
                {saveStatus === 'saved' && <span className="text-success">Changes saved!</span>}
                {saveStatus === 'error' && <span className="text-danger">Error saving changes</span>}
                {hasUnsavedChanges && <span className="text-warning">You have unsaved changes!</span>}
            </div>

            <div className="project-content">
                <div className="project-image-container position-relative mb-4" style={{ height: '400px' }}>
                    <div className="terminal-image-frame">
                        <div className="image-url-input-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
                            <div className="input-group">
                                <span className="input-group-text bg-dark text-light border-dark">Image URL:</span>
                                <input
                                    type="text"
                                    className="form-control bg-dark text-light border-dark"
                                    value={editedImageUrl}
                                    onChange={(e) => updateField('imageUrl', e.target.value)}
                                    placeholder="Enter image URL..."
                                />
                                <CldUploadWidget
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "terminal_portfolio"}
                                    options={{
                                        maxFiles: 1,
                                        resourceType: 'image',
                                        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
                                        maxFileSize: 5000000, // 5MB
                                        showAdvancedOptions: false,
                                        cropping: true,
                                        multiple: false,
                                        showPoweredBy: false,
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
                                                error: '#FF5050',
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
                                        <button
                                            className="btn btn-dark"
                                            type="button"
                                            onClick={() => open()}
                                            disabled={imageUploadStatus === 'uploading'}
                                        >
                                            <IconUpload size={16} />
                                            {imageUploadStatus === 'uploading' ? (
                                                <span className="ms-2">Uploading...</span>
                                            ) : (
                                                <span className="ms-2">Upload</span>
                                            )}
                                        </button>
                                    )}
                                </CldUploadWidget>
                            </div>
                        </div>

                        {editedImageUrl ? (
                            <Image
                                src={displayImageUrl}
                                alt={editedTitle}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded"
                                priority
                                onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    e.currentTarget.src = '/assets/img/projects/project1.webp';
                                }}
                            />
                        ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center h-100 bg-dark rounded text-light">
                                <IconPhoto size={64} opacity={0.5} />
                                <p className="mt-3">No image available</p>
                                <p className="text-muted">Upload an image or enter a URL above</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="terminal-section mb-4">
                    <div className="terminal-command">
                        <span className="terminal-prompt">$</span> cat {editedTitle.toLowerCase().replace(/\s+/g, '-') || 'project'}.info
                    </div>
                    <div className="terminal-output">
                        <input
                            type="text"
                            className="form-control bg-transparent border-0 terminal-header-text mb-3 fs-2"
                            value={editedTitle}
                            onChange={(e) => updateField('title', e.target.value)}
                            placeholder="Project Title"
                            style={{ boxShadow: 'none' }}
                        />

                        <textarea
                            className="form-control bg-transparent border-0 terminal-text"
                            value={editedDescription}
                            onChange={(e) => updateField('description', e.target.value)}
                            placeholder="Project description goes here..."
                            rows={5}
                            style={{ boxShadow: 'none' }}
                        />
                    </div>
                </div>

                <div className="terminal-section mb-4">
                    <div className="terminal-command">
                        <span className="terminal-prompt">$</span> ls -la technologies/
                    </div>
                    <div className="terminal-output">
                        <TagInput
                            tags={editedTags}
                            onTagsChange={(tags) => updateField('tags', tags)}
                            suggestions={tagSuggestions}
                        />
                    </div>
                </div>

                <div className="terminal-section mb-4">
                    <div className="terminal-command">
                        <span className="terminal-prompt">$</span> cat links.txt
                    </div>
                    <div className="terminal-output">
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            <div className="w-100 mb-2">
                                <div className="input-group">
                                    <span className="input-group-text bg-dark text-light border-dark">
                                        <i className="bi bi-github me-2"></i>GitHub:
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-light border-dark"
                                        value={editedGithubUrl}
                                        onChange={(e) => updateField('githubUrl', e.target.value)}
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>
                            </div>

                            <div className="w-100">
                                <div className="input-group">
                                    <span className="input-group-text bg-dark text-light border-dark">
                                        <i className="bi bi-globe me-2"></i>Live Demo:
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-light border-dark"
                                        value={editedLiveUrl}
                                        onChange={(e) => updateField('liveUrl', e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Changes Button */}
            <div className="d-flex justify-content-center mt-4 mb-5">
                <button
                    className={`btn terminal-btn ${hasUnsavedChanges ? 'btn-warning' : 'btn-outline-primary'}`}
                    onClick={handleSaveChanges}
                    disabled={!hasUnsavedChanges || saveStatus === 'saving'}
                    style={{
                        transition: 'all 0.3s ease',
                        opacity: hasUnsavedChanges ? 1 : 0.6,
                        background: hasUnsavedChanges ? 'rgba(255, 193, 7, 0.2)' : 'transparent',
                        borderColor: hasUnsavedChanges ? 'rgba(255, 193, 7, 0.7)' : '',
                        fontWeight: hasUnsavedChanges ? 'bold' : 'normal'
                    }}
                >
                    <span className="terminal-prompt">$</span> git commit -m &quot;Save Changes&quot;
                </button>
            </div>
        </Box>
    );
}