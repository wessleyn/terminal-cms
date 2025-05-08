'use server';

import { prisma, PrivacySection } from "@repo/db";

// Define the return type for the terms of service
interface TermsData {
    sections: PrivacySection[];
    updatedAt: Date;
    descPhrase: string;
}

interface ApiResponse<T> {
    success: boolean;
    error?: string;
    data?: T;
}

export async function fetchTermsOfService(): Promise<ApiResponse<TermsData>> {
    try {
        // Try to fetch terms of service
        let terms = await prisma.privacy.findUnique({
            where: {
                type: 'TERMS'
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
        if (!terms) {
            terms = await prisma.privacy.create({
                data: {
                    type: 'TERMS',
                    descPhrase: "Welcome to Terminal Blog. By accessing this website, you are agreeing to be bound by these Terms and Conditions of Use.",
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

            console.log('Created default terms of service');
        }

        return {
            success: true,
            data: {
                sections: terms.sections,
                updatedAt: terms.updatedAt,
                descPhrase: terms.descPhrase
            }
        };
    } catch (error) {
        console.error('Error fetching terms of service:', error);
        return {
            success: false,
            error: 'Failed to fetch terms of service',
            data: undefined
        };
    }
}