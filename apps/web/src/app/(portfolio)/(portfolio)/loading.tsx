import TitleCommand from "../_components/TitleCommand";
import { ArticleCardSkeleton } from "./_components/AwesomeBlogPosts/ArticleCardSkeleton";
import ProjectSkeleton from "./_components/AwesomeProjects/ProjectSkeleton";

export default function Loading() {
    return (
        <div className="col-md-8 offset-md-1">
            <div className="row">
                <div className="col">
                    <TitleCommand
                        title="ls -la ~/projects"
                        hoverTitle="cd ~/projects"
                        href="/projects"
                    />
                    <p className="mb-4">I build innovative web applications and digital solutions that are
                        responsive, accessible, and performant. Check out some of my recent projects below:</p>

                    <div className="row gx-3 gy-4">

                        <div className="col-md-6">
                            <ProjectSkeleton />
                        </div>
                        <div className="col-md-6">
                            <ProjectSkeleton />
                        </div>
                    </div>

                </div>
            </div>
            <div className="row mt-4">
                <div className="col">
                    <TitleCommand
                        title="ls -la ~/posts"
                        hoverTitle="cd ~/posts"
                        href="/blog/#recent"
                    />
                    <p className="mb-4">Below are some of my blogs</p>

                    <div className="row gx-3 gy-4">
                        <div className="col-md-6">
                            <ArticleCardSkeleton />
                        </div>
                        <div className="col-md-6">
                            <ArticleCardSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}