export enum PrivacyType {
    FAQ = "FAQ",
    BLOG = "BLOG",
    TERMS = "TERMS",
    PORTFOLIO = "PORTFOLIO"
}

export interface PrivacySection {
    id: string;
    privacyId: string;
    title: string;
    content: string;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Privacy {
    id: string;
    type: PrivacyType;
    descPhrase: string;
    sections: PrivacySection[];
    updatedAt: Date;
}

// API Response types that properly handle success/error states
export type ApiResponse<T = void> =
    | { success: true; data: T; error?: never }
    | { success: false; error: string; data?: never };
