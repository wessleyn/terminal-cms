import { fetchAwesomePost } from "../_actions/fetchAwesomePost";
import fetchAwesomeProj from "../_actions/fetchAwesomeProj";
import AwesomeBlogPosts from "./_components/AwesomeBlogPosts";
import AwesomeProjects from "./_components/AwesomeProjects";

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
        <AwesomeProjects awesomeProjects={awesomeProjects} />
      </div>
      <div className="row mt-4">
        <AwesomeBlogPosts blogPosts={blogPosts} />
      </div>
    </div>
  );
}
