'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { ApiResponse, PrivacySection, PrivacyType } from '../_types/types';

export async function createPrivacySection(
    type: PrivacyType = PrivacyType.PORTFOLIO,
    title: string = 'New Section',
    content: string = 'Enter content here'
): Promise<ApiResponse<PrivacySection>> {
    try {
        // First find the privacy document for the specified type
        const privacy = await prisma.privacy.findUnique({
            where: { type },
            include: {
                sections: {
                    orderBy: {
                        order: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!privacy) {
            return {
                success: false,
                error: `No privacy policy found for type: ${type}`
            };
        }

        // Get the highest current order value
        const nextOrder = privacy.sections.length > 0 ? privacy.sections[0]!.order + 1 : 0;

        // Create the new section
        const newSection = await prisma.privacySection.create({
            data: {
                title,
                content,
                order: nextOrder,
                privacyId: privacy.id
            }
        });

        revalidatePath('/dashboard/privacy');
        revalidatePath('/privacy');

        return { success: true, data: newSection };
    } catch (error) {
        console.error('Failed to create privacy section:', error);
        return {
            success: false,
            error: 'Failed to create privacy section'
        };
    }
}
