import { Metadata } from 'next';
import { fetchAllProjects } from './_actions/fetchAllProj';
import ProjectGallery from './_components/ProjectGallery';
import ProjectHero from './_components/ProjectHero';
import './_styles/projectGallery.css';

export const metadata: Metadata = {
    title: "Projects | Wessley's Terminal",
    description: "Browse my portfolio of software development projects showcasing my skills and experience.",
};

export default async function ProjectsPage() {
    // Fetch all projects from the database
    const { success, data: projects, error } = await fetchAllProjects();

    return (
        <div className="col-md-8 offset-md-1">
            <div className="row">
                <div className="col">
                    <ProjectHero />

                    {!success ? (
                        <div className="alert alert-danger">
                            <p>Error fetching projects: {error}</p>
                            <p>Please try again later.</p>
                        </div>
                    ) : projects && projects.length > 0 ? (
                        <ProjectGallery projects={projects} />
                    ) : (
                        <div className="terminal-output">
                            <p>No projects found.</p>
                            <p>$ echo &quot;Check back later for new projects!&quot;</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}