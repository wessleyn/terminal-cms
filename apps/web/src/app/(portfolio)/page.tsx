import fetchAwesomeProj from "./_actions/fetchAwesomeProj";
import ArticleCard from "./_components/ArticleCard";
import ProjectCard from "./_components/ProjectCard";
import TitleCommand from "./_components/TitleCommand";

// Add revalidation to refresh content every 60 seconds
export const revalidate = 60;

export default async function Home() {
  // Fetch awesome projects
  const awesomeProjects = await fetchAwesomeProj();

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
              <div className="col-12">
                <p className="text-muted">No awesome projects found. Check back soon!</p>
              </div>
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
          <p className="mb-4">Below are some of my blogs:</p>

          <div className="row gx-3 gy-4">
            <div className=" col-md-6">
              <ArticleCard />
            </div>
            <div className=" col-md-6">
              <ArticleCard />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
