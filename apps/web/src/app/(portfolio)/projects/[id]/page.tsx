import { notFound } from 'next/navigation';
import '../_styles/projectGallery.css';
import { fetchFeaturedProjectIds } from './_actions/fetchFeaturedProjectIds';
import { fetchProjectById } from './_actions/fetchProject';
import { getProjectNavigation } from './_actions/getProjectNavigation';
import ProjectDetail from './_components/ProjectDetail';

// Add revalidation to refresh content every 60 seconds
export const revalidate = 60;

// Generate static params for the most important projects to be prerendered
export async function generateStaticParams() {
    // Fetch IDs of featured or important projects that should be prerendered
    const featuredIds = await fetchFeaturedProjectIds();

    // Return an array of params objects that will be prerendered
    return featuredIds.map((id) => ({
        id: id,
    }));
}

interface ProjectPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
    const { id } = await params;
    const { data: project } = await fetchProjectById(id);

    if (!project) {
        return {
            title: 'Project Not Found',
            description: 'The requested project could not be found.',
        };
    }

    return {
        title: `${project.title} | Terminal Portfolio`,
        description: project.description,
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { id } = await params;
    const { success, data: project } = await fetchProjectById(id);

    if (!success || !project) {
        notFound();
    }

    // Get navigation for previous and next projects
    const { prevProject, nextProject } = await getProjectNavigation(id);

    return (
        <div className="col-md-9 terminal-theme project-page mx-0 py-0 -mr-4">
            <div className="container">
                <div className="terminal-window">
                    <div className="terminal-header">
                        <div className="terminal-buttons">
                            <span className="terminal-button close"></span>
                            <span className="terminal-button minimize"></span>
                            <span className="terminal-button maximize"></span>
                        </div>
                        <div className="terminal-title">{project.title}.md</div>
                    </div>
                    <div className="terminal-content p-4">
                        <ProjectDetail
                            id={project.id}
                            title={project.title}
                            description={project.description}
                            imageUrl={project.imageUrl}
                            tags={project.tags}
                            githubUrl={project.githubUrl}
                            liveUrl={project.liveUrl}
                            prevProject={prevProject}
                            nextProject={nextProject}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}