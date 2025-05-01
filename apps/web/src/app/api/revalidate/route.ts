import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const path = searchParams.get('path') || '/projects';

    // Check for valid secret
    if (secret !== process.env.REVALIDATION_SECRET) {
        console.log('Invalid revalidation secret');
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    try {
        console.log(`Revalidating path: ${path}`);
        // Revalidate the specific path
        revalidatePath(path);
        return NextResponse.json({ revalidated: true, path });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
    }
}