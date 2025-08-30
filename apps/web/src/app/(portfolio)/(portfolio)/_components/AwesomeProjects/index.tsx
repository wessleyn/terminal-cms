'use client'

import { Project } from "@repo/db"
import dynamic from 'next/dynamic'
import TitleCommand from "../../../_components/TitleCommand"
import ProjectSkeleton from "./ProjectSkeleton"

type ProjectWithEngagement = Project & {
    projectEngagement?: {
        shares: number;
        bookmarks: number;
        likes: number
    }
};

// Dynamically import the ProjectCard component
const ProjectCard = dynamic(() => import('./ProjectCard'), {
    loading: () => <ProjectSkeleton />,
    ssr: false
})

const AwesomeProjects = ({ awesomeProjects }: { awesomeProjects: ProjectWithEngagement[] }) => {
    return (
        <div className="col">
            <TitleCommand
                title="ls -la ~/projects"
                hoverTitle="cd ~/projects"
                href="/projects"
            />
            <p className="mb-4">I build innovative web applications and digital solutions that are
                responsive, accessible, and performant. Check out some of my recent projects below:</p>

            <div className="row gx-3 gy-4">
                {awesomeProjects.length > 0 ? (
                    awesomeProjects.map((project) => (
                        <div key={project.id} className="col-md-6">
                            <ProjectCard project={project} />
                        </div>
                    ))
                ) : (
                    // Show project skeletons when no projects are available
                    <>
                        <div className="col-md-6">
                            <ProjectSkeleton />
                        </div>
                        <div className="col-md-6">
                            <ProjectSkeleton />
                        </div>
                    </>
                )}
            </div>

        </div>
    )
}

export default AwesomeProjects