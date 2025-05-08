'use client';

import TechTags from '@repo/ui/components/shared/TechTags';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProjectGalleryCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    featured?: boolean;
}

export default function ProjectGalleryCard({
    id,
    title,
    description,
    imageUrl,
    tags,
    githubUrl,
    liveUrl,
    featured = false,
}: ProjectGalleryCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="project-card card h-100 shadow-sm border"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="position-relative">
                {/* Project Image */}
                <div className="position-relative" style={{ height: '200px' }}>
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="card-img-top"
                        style={{
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                        }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                </div>

                {/* Featured Badge */}
                {featured && (
                    <div className="badge bg-gradient position-absolute top-0 end-0 m-2 badge-primary-dragient">
                        <i className="bi bi-star-fill me-1"></i> Featured
                    </div>
                )}
            </div>

            <div className="card-body d-flex flex-column">
                <h3 className="h5 text-primary mb-2">{title}</h3>
                <p className="card-text small text-body-secondary mb-3">
                    {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                </p>

                <div className="d-flex flex-wrap gap-2 mb-3">
                    <TechTags
                        tags={tags}
                        iconSize={20}
                        limit={4}
                        className="mb-2"
                    />
                </div>
                {/* FIXME: Make these Links responsive to the viewport , like layering on top of each other when space starts to run out  */}
                <div className="d-flex gap-2 mt-auto">
                    <Link
                        href={`/projects/${id}`}
                        className="btn btn-sm btn-outline-primary"
                    >
                        <i className="bi bi-info-circle me-1"></i> Details
                    </Link>
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-secondary"
                        >
                            <i className="bi bi-github me-1"></i> GitHub
                        </a>
                    )}
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary"
                        >
                            <i className="bi bi-globe me-1"></i> Live
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}