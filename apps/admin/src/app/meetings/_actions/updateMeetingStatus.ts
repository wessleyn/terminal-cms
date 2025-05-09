'use server';

import { MeetingStatus, prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

/**
 * Update the status of a meeting
 */
export async function updateMeetingStatus(formData: FormData) {
    const meetingId = formData.get('meetingId') as string;
    const status = formData.get('newStatus') as MeetingStatus;

    if (!meetingId) {
        throw new Error('Meeting ID is required');
    }

    // Update the meeting in the database (add status field to the model if needed)
    // For now, let's at least try to update the notes field with the status
    await prisma.scheduledMeeting.update({
        where: { id: meetingId },
        data: {
            status
        },
    });

    // Revalidate to refresh the data
    revalidatePath('/meetings');
    revalidatePath(`/meetings/${meetingId}`);
}