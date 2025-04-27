'use client';

import { Box } from "@mantine/core";
import { TechTag } from "@repo/ui/components/shared";
import Image from 'next/image';
import Link from "next/link";

interface NavigationProject {
  id: string;
  title: string;
}

interface ProjectDetailProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  prevProject?: NavigationProject | null;
  nextProject?: NavigationProject | null;
}

export default function ProjectDetail({
  id,
  title,
  description,
  imageUrl,
  tags,
  githubUrl,
  liveUrl,
  prevProject = null,
  nextProject = null,
}: ProjectDetailProps) {
  return (
    <Box className="project-detail" data-project-id={id}>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Link href="/projects" className="btn btn-outline-primary terminal-btn">
          <span className="terminal-prompt">$</span> cd ../projects
        </Link>
      </div>

      <div className="project-content">
        <div className="project-image-container position-relative mb-4" style={{ height: '400px' }}>
          <div className="terminal-image-frame">
            <Image
              src={imageUrl || '/assets/img/projects/project1.webp'}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded"
              priority
            />
          </div>
        </div>

        <div className="terminal-section mb-4">
          <div className="terminal-command">
            <span className="terminal-prompt">$</span> cat {title.toLowerCase().replace(/\s+/g, '-') || 'project'}.info
          </div>
          <div className="terminal-output">
            <h1 className="terminal-header-text mb-3">{title}</h1>
            <p className="terminal-text">{description}</p>
          </div>
        </div>

        <div className="terminal-section mb-4">
          <div className="terminal-command">
            <span className="terminal-prompt">$</span> ls -la technologies/
          </div>
          <div className="terminal-output">
            <TechTag tags={tags} iconSize={32} className="mb-3" />
          </div>
        </div>

        <div className="terminal-section mb-4">
          <div className="terminal-command">
            <span className="terminal-prompt">$</span> cat links.txt
          </div>
          <div className="terminal-output">
            <div className="d-flex flex-wrap gap-2 mt-2">
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-link"
                >
                  <i className="bi bi-github me-2"></i>GitHub: {githubUrl}
                </a>
              ) : (
                <span className="text-muted"><i className="bi bi-github me-2"></i>No GitHub link provided</span>
              )}

              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-link"
                >
                  <i className="bi bi-globe me-2"></i>Live Demo: {liveUrl}
                </a>
              ) : (
                <span className="text-muted"><i className="bi bi-globe me-2"></i>No live demo link provided</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {(prevProject || nextProject) && (
        <div className="project-navigation">
          <div className="d-flex justify-content-between flex-wrap mt-5">
            <div className="mb-2">
              {prevProject && (
                <Link
                  href={`/projects/${prevProject.id}`}
                  className="btn btn-outline-primary terminal-btn"
                >
                  <i className="bi bi-arrow-left me-2"></i> {prevProject.title}
                </Link>
              )}
            </div>
            <div className="mb-2">
              {nextProject && (
                <Link
                  href={`/projects/${nextProject.id}`}
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
