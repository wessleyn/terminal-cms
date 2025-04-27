'use client';

import { Box } from '@mantine/core';
import { ActivityStatus, HappyIndex, PublishStatus } from '@repo/db';
import { TagInput, TechTag } from '@repo/ui/components/shared';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { newStatus, UpdateField, updateProject, updateProjectStatus } from '../../_actions/updateProject';

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

    // Handle saving all changes at once
    const handleSaveChanges = async (updates: Record<string, string | string[]>) => {
        setSaveStatus('saving');

        try {
            // Construct the data object with the updated fields while maintaining the required structure
            const updateData = {
                title: updates.title as string || project.title,
                description: updates.description as string || project.description,
                imageUrl: (updates.imageUrl as string) || project.imageUrl || '',
                tags: (updates.tags as string[]) || project.tags,
                githubUrl: (updates.githubUrl as string) || project.githubUrl || '',
                liveUrl: (updates.liveUrl as string) || project.liveUrl || '',
            };

            const result = await updateProject(project.id, updateData);

            if (!result.success) {
                throw new Error(result.error);
            }

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);

            // Refresh the page to get updated data
            router.refresh();

        } catch (error) {
            console.error(`Error updating project:`, error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Handle status changes
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

    return (
        <Box>
            <SharedProjectDetail
                id={project.id}
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl || ''}
                tags={project.tags || []}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
                publishStatus={project.publishStatus}
                activityStatus={project.activityStatus}
                happyIndexStatus={project.happyIndex}
                isEditable={true}
                onSave={handleSaveChanges}
                onStatusChange={handleStatusChange}
                saveStatus={saveStatus}
            />
        </Box>
    );
}

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import ActivityStatusBadge from '../../_components/ActivityStatusBadge';
import HappyStatusBadge from '../../_components/HappyStatusBadge';
import PublishStatusBadge from '../../_components/PublishStatusBadge';
import '../_styles/projectGallery.css';

interface NavigationProject {
    id: string;
    title: string;
}

export interface SharedProjectDetailProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    publishStatus?: PublishStatus;
    activityStatus?: ActivityStatus;
    happyIndexStatus?: HappyIndex
    prevProject?: NavigationProject | null;
    nextProject?: NavigationProject | null;
    isEditable?: boolean;
    onSave?: (updates: Record<string, string | string[]>) => Promise<void>;
    onStatusChange?: (statusType: UpdateField, value:  newStatus) => Promise<void>;
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

// TODO: Add a dropzone for the project image
function SharedProjectDetail({
    id,
    title,
    description,
    imageUrl,
    tags,
    githubUrl,
    liveUrl,
    publishStatus = PublishStatus.DRAFT,
    activityStatus = ActivityStatus.ARCHIVED,
    happyIndexStatus = HappyIndex.NEUTRAL,
    prevProject = null,
    nextProject = null,
    isEditable = false,
    onSave,
    onStatusChange,
    saveStatus = 'idle',
}: SharedProjectDetailProps) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    // State for editable fields
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDescription, setEditedDescription] = useState(description);
    const [editedImageUrl, setEditedImageUrl] = useState(imageUrl || '');
    const [editedTags, setEditedTags] = useState(tags || []);
    const [editedGithubUrl, setEditedGithubUrl] = useState(githubUrl || '');
    const [editedLiveUrl, setEditedLiveUrl] = useState(liveUrl || '');

    // State to track changes for the save button
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Store original values for comparison
    const originalValues = useMemo(() => ({
        title,
        description,
        imageUrl: imageUrl || '',
        tags: tags || [],
        githubUrl: githubUrl || '',
        liveUrl: liveUrl || ''
    }), [title, description, imageUrl, tags, githubUrl, liveUrl]);

    // Fields to check against original values
    const fieldsToCheck = {
        title: editedTitle,
        description: editedDescription,
        imageUrl: editedImageUrl,
        tags: editedTags,
        githubUrl: editedGithubUrl,
        liveUrl: editedLiveUrl
    };

    // Function to check if any field has changed from original
    const checkForChanges = (currentFields = fieldsToCheck) => {
        // Check for differences between current and original values
        const hasChanges =
            currentFields.title !== originalValues.title ||
            currentFields.description !== originalValues.description ||
            currentFields.imageUrl !== originalValues.imageUrl ||
            currentFields.githubUrl !== originalValues.githubUrl ||
            currentFields.liveUrl !== originalValues.liveUrl ||
            !arraysEqual(currentFields.tags, originalValues.tags);

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

    // Determine back link based on context (dashboard or frontend)
    const backLink = isDashboard ? '/dashboard/projects' : '/projects';

    // Add default image if imageUrl is empty
    const displayImageUrl = editedImageUrl || '/assets/img/projects/project1.webp';

    // Pre-defined tag suggestions
    const tagSuggestions = [
        'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js',
        'Express', 'MongoDB', 'PostgreSQL', 'CSS', 'Tailwind',
        'Redux', 'GraphQL', 'API', 'Authentication', 'Bootstrap',
        'Material UI', 'Firebase', 'AWS', 'Docker', 'CI/CD'
    ];

    // Update any field value and mark as having unsaved changes
    const updateField = (field: string, value: string | string[]) => {
        switch (field) {
            case 'title':
                setEditedTitle(value as string);
                checkForChanges({ ...fieldsToCheck, title: value as string });
                break;
            case 'description':
                setEditedDescription(value as string);
                checkForChanges({ ...fieldsToCheck, description: value as string });
                break;
            case 'imageUrl':
                setEditedImageUrl(value as string);
                checkForChanges({ ...fieldsToCheck, imageUrl: value as string });
                break;
            case 'tags':
                setEditedTags(value as string[]);
                checkForChanges({ ...fieldsToCheck, tags: value as string[] });
                break;
            case 'githubUrl':
                setEditedGithubUrl(value as string);
                checkForChanges({ ...fieldsToCheck, githubUrl: value as string });
                break;
            case 'liveUrl':
                setEditedLiveUrl(value as string);
                checkForChanges({ ...fieldsToCheck, liveUrl: value as string });
                break;
            default:
                return;
        }
    };

    // Handle saving all changes at once
    const handleSaveChanges = async () => {
        if (!onSave || !hasUnsavedChanges) return;

        try {
            await onSave({
                title: editedTitle,
                description: editedDescription,
                imageUrl: editedImageUrl,
                tags: editedTags,
                githubUrl: editedGithubUrl,
                liveUrl: editedLiveUrl
            });
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    // Handle tag changes
    const handleTagsChange = (newTags: string[]) => {
        updateField('tags', newTags);
    };

    // Handle status change
    const handleStatusChange = async (statusType: UpdateField, newValue: newStatus) => {
        if (onStatusChange) {
            await onStatusChange(statusType, newValue);
        }
    };


    return (
        <Box
            className="project-detail"
            data-project-id={id}
            style={{
                border: hasUnsavedChanges ? '2px solid rgba(255, 193, 7, 0.5)' : 'none',
                borderRadius: hasUnsavedChanges ? '8px' : '0',
                padding: hasUnsavedChanges ? '20px' : '0',
                transition: 'all 0.3s ease'
            }}
        >
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <Link href={backLink} className="btn btn-outline-primary terminal-btn">
                    <span className="terminal-prompt">$</span> cd ../{isDashboard ? 'dashboard/' : ''}projects
                </Link>

                {isEditable && (
                    <div className="d-flex align-items-center gap-3">
                       <PublishStatusBadge status={publishStatus} onStatusChange={(status) => handleStatusChange('publishStatus', status)} />
                       <HappyStatusBadge status={happyIndexStatus} onStatusChange={(status) => handleStatusChange('happyIndex', status)} />
                       <ActivityStatusBadge status={activityStatus} onStatusChange={(status) => handleStatusChange('activityStatus', status)} />
                    </div>
                )}
            </div>

            {isEditable && (
                <div className="save-status mb-3">
                    {saveStatus === 'saving' && <span className="text-info">Saving changes...</span>}
                    {saveStatus === 'saved' && <span className="text-success">Changes saved!</span>}
                    {saveStatus === 'error' && <span className="text-danger">Error saving changes</span>}
                    {hasUnsavedChanges && <span className="text-warning">You have unsaved changes!</span>}
                </div>
            )}

            <div className="project-content">
                <div className="project-image-container position-relative mb-4" style={{ height: '400px' }}>
                    <div className="terminal-image-frame">
                        {isEditable ? (
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
                        ) : null}
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
                        {isEditable ? (
                            <input
                                type="text"
                                className="form-control bg-transparent border-0 terminal-header-text mb-3 fs-2"
                                value={editedTitle}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="Project Title"
                                style={{ boxShadow: 'none' }}
                            />
                        ) : (
                            <h1 className="terminal-header-text mb-3">{editedTitle}</h1>
                        )}

                        {isEditable ? (
                            <textarea
                                className="form-control bg-transparent border-0 terminal-text"
                                value={editedDescription}
                                onChange={(e) => updateField('description', e.target.value)}
                                placeholder="Project description goes here..."
                                rows={5}
                                style={{ boxShadow: 'none' }}
                            />
                        ) : (
                            <p className="terminal-text">{editedDescription}</p>
                        )}
                    </div>
                </div>

                <div className="terminal-section mb-4">
                    <div className="terminal-command">
                        <span className="terminal-prompt">$</span> ls -la technologies/
                    </div>
                    <div className="terminal-output">
                        {isEditable ? (
                            <TagInput
                                tags={editedTags}
                                onTagsChange={handleTagsChange}
                                suggestions={tagSuggestions}
                            />
                        ) : (
                            <TechTag
                                tags={editedTags}
                                iconSize={32}
                                className="mb-3"
                            />
                        )}
                    </div>
                </div>

                <div className="terminal-section mb-4">
                    <div className="terminal-command">
                        <span className="terminal-prompt">$</span> cat links.txt
                    </div>
                    <div className="terminal-output">
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {isEditable ? (
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
                                            // TODO: Create a github handle settings
                                            placeholder="https://github.com/username/repo"
                                        />
                                    </div>
                                </div>
                            ) : (
                                editedGithubUrl ? (
                                    <a
                                        href={editedGithubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="terminal-link"
                                    >
                                        <i className="bi bi-github me-2"></i>GitHub: {editedGithubUrl}
                                    </a>
                                ) : (
                                    <span className="text-muted"><i className="bi bi-github me-2"></i>No GitHub link provided</span>
                                )
                            )}

                            {isEditable ? (
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
                            ) : (
                                editedLiveUrl ? (
                                    <a
                                        href={editedLiveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="terminal-link"
                                    >
                                        <i className="bi bi-globe me-2"></i>Live Demo: {editedLiveUrl}
                                    </a>
                                ) : (
                                    <span className="text-muted"><i className="bi bi-globe me-2"></i>No live demo link provided</span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Changes Button */}
            {isEditable && (
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
            )}

            {(prevProject || nextProject) && (
                <div className="project-navigation">
                    <div className="d-flex justify-content-between flex-wrap mt-5">
                        <div className="mb-2">
                            {prevProject && (
                                <Link
                                    href={`${isDashboard ? '/dashboard' : ''}/projects/${prevProject.id}`}
                                    className="btn btn-outline-primary terminal-btn"
                                >
                                    <i className="bi bi-arrow-left me-2"></i> {prevProject.title}
                                </Link>
                            )}
                        </div>
                        <div className="mb-2">
                            {nextProject && (
                                <Link
                                    href={`${isDashboard ? '/dashboard' : ''}/projects/${nextProject.id}`}
                                    className="btn btn-outline-primary terminal-btn"
                                >
                                    {nextProject.title} <i className="bi bi-arrow-right ms-2"></i>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Box>
    );
}