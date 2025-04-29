'use client';

import { Box } from '@mantine/core';
import { ActivityStatus, HappyIndex, PublishStatus } from '@repo/db';
import { TagInput } from '@repo/ui/components/shared';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

    // Handle status change
    const handleStatusChange = async (statusType: UpdateField, value: newStatus) => {
        setSaveStatus('saving');

        try {
            // Call the specific updateProjectStatus function for status changes
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

            // Refresh the page to get updated data
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
                            </div>
                        </div>
                        <Image
                            src={displayImageUrl}
                            alt={editedTitle}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded"
                            priority
                        />
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