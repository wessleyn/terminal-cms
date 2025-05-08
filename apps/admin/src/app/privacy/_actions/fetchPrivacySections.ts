'use server';

import { prisma, PrivacyType } from '@repo/db';
import { ApiResponse, PrivacySection } from '../_types/types';

export async function fetchPrivacySections(type: PrivacyType = PrivacyType.PORTFOLIO): Promise<ApiResponse<PrivacySection[]>> {
    try {
        // Try to find the privacy record with the specified type
        let privacy = await prisma.privacy.findUnique({
            where: { type },
            include: {
                sections: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        // If not found, create it with default values
        if (!privacy) {
            privacy = await prisma.privacy.create({
                data: {
                    type,
                    descPhrase: `This is the default ${type.toLowerCase()} privacy policy. Edit this text to customize it.`,
                    // Start with empty sections
                    sections: {
                        create: []
                    }
                },
                include: {
                    sections: true
                }
            });

        }

        return {
            success: true,
            data: privacy.sections
        };
    } catch (error) {
        console.error('Failed to fetch privacy sections:', error);
        return {
            success: false,
            error: 'Failed to load privacy policy sections'
        };
    }
}

export async function getPrivacyDetails(type: PrivacyType = PrivacyType.PORTFOLIO) {
    try {
        const privacy = await prisma.privacy.findUnique({
            where: { type },
            select: {
                id: true,
                descPhrase: true,
                updatedAt: true
            }
        });

        return { success: true, data: privacy };
    } catch (error) {
        console.error('Failed to fetch privacy details:', error);
        return {
            success: false,
            error: 'Failed to fetch privacy details'
        };
    }
}
