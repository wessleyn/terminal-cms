// Export only the type definitions from Prisma
// This avoids importing runtime code that causes browser errors

// Enum types for use in browser contexts
export enum ActivityStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    ABANDONED = "ABANDONED",
    ARCHIVED = "ARCHIVED"
}

export enum PublishStatus {
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED",
    DRAFT = "DRAFT"
}

export enum HappyIndex {
    AWESOME = "AWESOME",
    USEFUL = "USEFUL",
    COOL = "COOL",
    NEUTRAL = "NEUTRAL"
}

export enum ProjectType {
    SOLO = "SOLO",
    FEATURED = "FEATURED"
}

export enum PortfolioSocialType {
    GITHUB = "GITHUB",
    LINKEDIN = "LINKEDIN",
    TWITTER = "TWITTER",
    INSTAGRAM = "INSTAGRAM",
    FACEBOOK = "FACEBOOK",
    YOUTUBE = "YOUTUBE",
    OTHER = "OTHER"
}

// Only import types from Prisma's generated code
export type {
    PortfolioProfile,
    PortfolioProfileImage,
    PortfolioSocial,
    Prisma, Project
} from "../generated/prisma";

