'use server';

import { prisma } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Delete a meeting record
 */
export async function deleteMeeting(formData: FormData) {
    const meetingId = formData.get('meetingId') as string;

    if (!meetingId) {
        throw new Error('Meeting ID is required');
    }

    // Delete the meeting from the database using the ScheduledMeeting model
    await prisma.scheduledMeeting.delete({
        where: { id: meetingId },
    });

    // Revalidate and redirect back to meetings list
    revalidatePath('/meetings');
    redirect('/meetings');
}