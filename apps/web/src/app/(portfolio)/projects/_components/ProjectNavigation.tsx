import Link from 'next/link';

interface ProjectNavigationProps {
    prevProject: { id: string; title: string } | null;
    nextProject: { id: string; title: string } | null;
}

export default function ProjectNavigation({ prevProject, nextProject }: ProjectNavigationProps) {
    return (
        <div className="d-flex justify-content-between align-items-center mt-4">
            {prevProject ? (
                <Link href={`/projects/${prevProject.id}`} className="btn btn-outline-primary">
                    &larr; {prevProject.title}
                </Link>
            ) : (
                <span className="text-muted">No previous project</span>
            )}

            {nextProject ? (
                <Link href={`/projects/${nextProject.id}`} className="btn btn-outline-primary">
                    {nextProject.title} &rarr;
                </Link>
            ) : (
                <span className="text-muted">No next project</span>
            )}
        </div>
    );
}