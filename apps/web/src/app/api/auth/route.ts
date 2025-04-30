import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';

// Add a GET method to support checking authentication from middleware
export async function GET(request: Request) {
    const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    console.log(`[Auth][${requestId}] Authentication request received`);
    
    try {
        // Extract token from Authorization header
        const authHeader = request.headers.get('Authorization');
        console.log(`[Auth][${requestId}] Checking authorization header: ${authHeader ? 'present' : 'missing'}`);

        if (!authHeader) {
            console.log(`[Auth][${requestId}] Authentication failed: No authorization header`);
            return NextResponse.json({ authenticated: false, reason: 'No authorization header' }, { status: 401 });
        }

        console.log(`[Auth][${requestId}] Validating authorization header format`);
        if (!authHeader.startsWith('Bearer ')) {
            console.log(`[Auth][${requestId}] Authentication failed: Invalid authorization format`);
            return NextResponse.json({ authenticated: false, reason: 'Invalid authorization format' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        console.log(`[Auth][${requestId}] Token extracted: ${token ? `${token.substring(0, 6)}...` : 'none'}`);

        if (!token) {
            console.log(`[Auth][${requestId}] Authentication failed: No token provided`);
            return NextResponse.json({ authenticated: false, reason: 'No token provided' }, { status: 401 });
        }

        // Use Prisma client instead of direct neon connection
        console.log(`[Auth][${requestId}] Looking up session in database`);
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
        console.log(`[Auth][${requestId}] Session found: ${session ? 'yes' : 'no'}`);
        if (!session) {
            console.log(`[Auth][${requestId}] Authentication failed: Invalid or expired token`);
            return NextResponse.json({ authenticated: false, reason: 'Invalid or expired token' }, { status: 401 });
        }

        // Check if session is expired
        const isExpired = new Date(session.expires) < new Date();
        console.log(`[Auth][${requestId}] Checking session expiration: ${isExpired ? 'expired' : 'valid'}, expires: ${session.expires}`);
        
        if (isExpired) {
            console.log(`[Auth][${requestId}] Authentication failed: Session expired`);
            return NextResponse.json({ authenticated: false, reason: 'Session expired' }, { status: 401 });
        }

        console.log(`[Auth][${requestId}] Authentication successful for user ${session.user.id} with role ${session.user.role}`);
        
        // Return user info including role so middleware can make role-based decisions
        return NextResponse.json({
            authenticated: true,
            userId: session.user.id,
            role: session.user.role
        }, { status: 200 });

    } catch (error) {
        console.error(`[Auth][${requestId}] Session verification error:`, error);
        return NextResponse.json({ authenticated: false, reason: 'Server error', error: 'Internal server error' }, { status: 500 });
    } finally {
        console.log(`[Auth][${requestId}] Authentication process completed`);
    }
}