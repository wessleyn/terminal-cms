'use server';

/**
 * Validates a Turnstile token by checking its format
 * In production, this should make a request to Cloudflare's API to verify the token
 */
export async function validateTurnstile(token: string | null): Promise<{
    success: boolean;
    errorMessage?: string;
}> {
    // Skip validation in development for easier testing
    if (process.env.NODE_ENV !== 'production') {
        return { success: true };
    }

    // Check if token exists
    if (!token) {
        return {
            success: false,
            errorMessage: 'CAPTCHA verification failed. Please try again.'
        };
    }

    // Basic validation of token format
    if (typeof token !== 'string' || token.length < 10) {
        return {
            success: false,
            errorMessage: 'Invalid CAPTCHA response. Please try again.'
        };
    }

    // In a production environment, verify the token with Cloudflare API
    // const formData = new FormData();
    // formData.append('secret', process.env.TURNSTILE_SECRET_KEY || '');
    // formData.append('response', token);

    // try {
    //     const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    //         method: 'POST',
    //         body: formData
    //     });
    //     const data = await result.json();
    //     return { success: !!data.success };
    // } catch (error) {
    //     console.error('Error verifying Turnstile:', error);
    //     return {
    //         success: false,
    //         errorMessage: 'Error verifying CAPTCHA. Please try again.'
    //     };
    // }

    // For now, just return success since we've verified the basic token format
    return { success: true };
}