'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';

/**
 * Update the notes for a meeting
 */
export async function updateMeetingNotes(formData: FormData) {
    const meetingId = formData.get('meetingId') as string;
    const noteContent = formData.get('notes') as string;

    if (!meetingId) {
        throw new Error('Meeting ID is required');
    }

    // Find existing meeting notes (if any)
    const meeting = await prisma.scheduledMeeting.findUnique({
        where: { id: meetingId },
        include: { meetingNotes: true }
    });

    if (!meeting) {
        throw new Error('Meeting not found');
    }

    // Create new note
    await prisma.scheduledMeetingNote.create({
        data: {
            note: noteContent,
            scheduledMeetingId: meetingId
        }
    });

    // Update the meeting's updatedAt timestamp
    await prisma.scheduledMeeting.update({
        where: { id: meetingId },
        data: { updatedAt: new Date() }
    });

    // Revalidate to refresh the data
    revalidatePath('/meetings');
    revalidatePath(`/meetings/${meetingId}`);
}