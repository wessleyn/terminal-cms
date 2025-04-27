'use client';

import { useEffect, useState } from 'react';
import ProjectGalleryCard from './ProjectGalleryCard';

type Project = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    githubUrl: string | null;
    liveUrl: string | null;
    tags: string[];
    featured: boolean;
};

interface ProjectGalleryProps {
    projects: Project[];
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
    const [filter, setFilter] = useState<string>('all');
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Extract unique tags from all projects
    const allTags = ['Desktop', 'Mobile'];

    useEffect(() => {
        let result = [...projects];

        // Apply tag filter
        if (filter !== 'all') {
            result = result.filter(project => project.tags.includes(filter));
        }

        // Apply search term
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(project =>
                project.title.toLowerCase().includes(term) ||
                project.description.toLowerCase().includes(term) ||
                project.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        setFilteredProjects(result);
    }, [filter, searchTerm, projects]);

    return (
        <div className="project-gallery-container">
            <div className="terminal-section mb-4">
                <div className="terminal-command mb-3">
                    <span className="terminal-prompt">$</span> find ./projects -type f -name &quot;*.project&quot; | sort
                </div>

                <div className="terminal-output">
                    <div className="filter-container mb-4">
                        <div className="row g-3">
                            <div className="col-md-6 mb-3 mb-md-0">
                                <div className="input-group">
                                    <span className="input-group-text bg-dark border-secondary">
                                        <i className="bi bi-search text-primary"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="grep -i ..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex flex-wrap gap-2">
                                    <button
                                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setFilter('all')}
                                    >
                                        All
                                    </button>
                                    {allTags.map((tag) => (
                                        <button
                                            key={tag}
                                            className={`btn btn-sm ${filter === tag ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilter(tag)}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredProjects.length === 0 ? (
                        <div className="text-center p-5 terminal-content">
                            <p className="mb-0">No matching projects found.</p>
                            <p className="mb-0 text-muted">
                                <span className="terminal-prompt">$</span> echo &quot;Try adjusting your search criteria&quot;
                            </p>
                        </div>
                    ) : (
                        <div className="project-grid mb-4">
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                                {filteredProjects.map((project) => (
                                    <div key={project.id} className="col">
                                        <div className="h-100">
                                            <ProjectGalleryCard
                                                id={project.id}
                                                title={project.title}
                                                description={project.description}
                                                imageUrl={project.imageUrl}
                                                tags={project.tags}
                                                githubUrl={project.githubUrl}
                                                liveUrl={project.liveUrl}
                                                featured={project.featured}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}