import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';

// Add a GET method to support checking authentication from middleware
export async function GET(request: Request) {
    try {
        // Extract token from Authorization header
        const authHeader = request.headers.get('Authorization');

        if (!authHeader) {
            return NextResponse.json({ authenticated: false, reason: 'No authorization header' }, { status: 401 });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ authenticated: false, reason: 'Invalid authorization format' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return NextResponse.json({ authenticated: false, reason: 'No token provided' }, { status: 401 });
        }

        // Use Prisma client instead of direct neon connection
        const session = await prisma.session.findUnique({
            where: {
                sessionToken: token
            },
            select: {
                user: {
                    select: {
                        role: true,
                        id: true,
                    }
                },
                expires: true
            }
        });

        // Check if session exists
        if (!session) {
            return NextResponse.json({ authenticated: false, reason: 'Invalid or expired token' }, { status: 401 });
        }

        // Check if session is expired
        const isExpired = new Date(session.expires) < new Date();
        if (isExpired) {
            return NextResponse.json({ authenticated: false, reason: 'Session expired' }, { status: 401 });
        }

        // Return user info including role so middleware can make role-based decisions
        return NextResponse.json({
            authenticated: true,
            userId: session.user.id,
            role: session.user.role
        }, { status: 200 });

    } catch (error) {
        console.error('Session verification error:', error);
        return NextResponse.json({ authenticated: false, reason: 'Server error', error: 'Internal server error' }, { status: 500 });
    }
}