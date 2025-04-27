'use server';

import { prisma, PrivacySection } from "@repo/db";


// Define the return type for the privacy policy
interface PrivacyPolicyData {
    sections: PrivacySection[];
    updatedAt: Date;
    descPhrase: string;
}

interface ApiResponse<T> {
    success: boolean;
    error?: string;
    data?: T;
}

export async function fetchPrivacyPolicy(): Promise<ApiResponse<PrivacyPolicyData>> {
    try {
        // Try to fetch privacy policy for PORTFOLIO type
        let privacy = await prisma.privacy.findUnique({
            where: {
                type: 'PORTFOLIO'
            },
            include: {
                sections: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        // If not found, create a default one
        if (!privacy) {
            privacy = await prisma.privacy.create({
                data: {
                    type: 'PORTFOLIO',
                    descPhrase: "This Privacy Policy describes how your personal information is collected, used, and shared when you visit this website.",
                    sections: {
                        create: [] // Start with no sections
                    }
                },
                include: {
                    sections: {
                        orderBy: {
                            order: 'asc'
                        }
                    }
                }
            });

            console.log('Created default privacy policy for PORTFOLIO');
        }

        return {
            success: true,
            data: {
                sections: privacy.sections,
                updatedAt: privacy.updatedAt,
                descPhrase: privacy.descPhrase
            }
        };
    } catch (error) {
        console.error('Error fetching privacy policy:', error);
        return {
            success: false,
            error: 'Failed to fetch privacy policy',
            data: undefined
        };
    }
}