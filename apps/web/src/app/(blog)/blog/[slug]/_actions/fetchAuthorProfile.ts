import { PortfolioProfileSocialLink, prisma } from "@repo/db";

export interface AuthorProfile {
    name: string;
    bio: string;
    avatarUrl: string | null;
    socials: PortfolioProfileSocialLink[];
}

export default async function fetchAuthorProfile(): Promise<AuthorProfile> {
    const info = await prisma.portfolioProfile.findFirst({
        select: {
            displayName: true,
            socialLinks: true,
            avatars: {
                select: {
                    url: true,
                },
                where: {
                    isNew: true,
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1
            },
            description: true
        }
    })

    if (!info) {
        throw new Error("Author profile not found. Contact the administrator.");
    }

    return {
        name: info.displayName,
        bio: info.description,
        avatarUrl: info.avatars[0]?.url || null,
        socials: info.socialLinks
    }
}