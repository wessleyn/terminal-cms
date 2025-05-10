import { prisma, PublishStatus } from "@repo/db";

/**
 * Fetches IDs of featured projects that should be prerendered at build time.
 * This improves performance for the most commonly accessed projects.
 */
export async function fetchFeaturedProjectIds(): Promise<string[]> {
  try {
    // Fetch projects marked as featured or that have high engagement
    const featuredProjects = await prisma.project.findMany({
      where: {
        publishStatus: PublishStatus.PUBLISHED,
      },
      select: { id: true },
      take: 5, // Limit to a reasonable number for build time
    });

    return featuredProjects.map(project => project.id);
  } catch (error) {
    console.error("Error fetching featured project IDs:", error);
    return []; // Return empty array on error to avoid build failures
  }
}
