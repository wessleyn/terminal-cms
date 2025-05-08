import { Skeleton } from "@repo/ui/components/mantine";
import { fetchAwesomePost } from "./_actions/fetchAwesomePost";
import fetchAwesomeProj from "./_actions/fetchAwesomeProj";
import ArticleCard from "./_components/ArticleCard";
import ProjectCard from "./_components/ProjectCard";
import ProjectSkeleton from "./_components/ProjectCard/ProjectSkeleton";
import TitleCommand from "./_components/TitleCommand";

// Add revalidation to refresh content every 60 seconds
export const revalidate = 60;

export default async function Home() {
  // Fetch awesome projects
  const awesomeProjects = await fetchAwesomeProj();
  // Fetch blog posts
  const blogPosts = await fetchAwesomePost();

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
      </div>
      <div className="row mt-4">
        <div className="col">
          <TitleCommand
            title="ls -la ~/articles"
            hoverTitle="cd ~/articles"
            href="/articles"
          />
          <p className="mb-4">Below are some of my blogs</p>

          <div className="row gx-3 gy-4">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <div key={post.id} className="col-md-6">
                  <ArticleCard post={post} />
                </div>
              ))
            ) : (
              <>
                <div className="col-md-6">
                  <Skeleton style={{ height: '280px' }} className="bg-dark w-full" />
                </div>
                <div className="col-md-6">
                  <Skeleton style={{ height: '280px' }} className="bg-dark w-full" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
