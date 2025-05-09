'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

interface WindowWithTurnstile extends Window {
    turnstile?: {
        render: (container: string | HTMLElement, options: TurnstileOptions) => string;
        reset: (widgetId?: string) => void;
    };
}

interface TurnstileOptions {
    sitekey: string;
    callback?: (token: string) => void;
    'error-callback'?: () => void;
    'expired-callback'?: () => void;
    theme?: 'light' | 'dark' | 'auto';
    action?: string;
}

interface TurnstileProps {
    siteKey: string;
    onVerify?: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
    theme?: 'light' | 'dark' | 'auto';
    action?: string;
    id?: string;
}

export function Turnstile({
    siteKey,
    onVerify,
    onError,
    onExpire,
    theme = 'dark',
    action,
    id = 'turnstile-widget'
}: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // Initialize Turnstile when the script is loaded
    useEffect(() => {
        const windowWithTurnstile = window as WindowWithTurnstile;

        // Only try to render if the script is loaded and container exists
        if (isScriptLoaded && containerRef.current && windowWithTurnstile.turnstile) {
            try {
                renderTurnstile();
            } catch (error) {
                console.error('Error rendering Turnstile:', error);
                onError?.();
            }
        }

        return () => {
            // Cleanup widget when component unmounts
            if (widgetIdRef.current) {
                try {
                    const windowWithTurnstile = window as WindowWithTurnstile;
                    windowWithTurnstile.turnstile?.reset(widgetIdRef.current);
                } catch (error) {
                    console.error('Error resetting Turnstile:', error);
                }
            }
        };
    }, [isScriptLoaded]);

    // Render Turnstile widget with error handling
    const renderTurnstile = () => {
        const windowWithTurnstile = window as WindowWithTurnstile;
        if (!containerRef.current || !windowWithTurnstile.turnstile) return;

        // Make sure we don't have a previous instance
        if (widgetIdRef.current) {
            try {
                windowWithTurnstile.turnstile.reset(widgetIdRef.current);
                widgetIdRef.current = null;
            } catch (error) {
                console.error('Error resetting previous Turnstile instance:', error);
            }
        }

        // Configuration for Turnstile
        const options: TurnstileOptions = {
            sitekey: siteKey,
            callback: (token) => {
                if (onVerify) {
                    try {
                        onVerify(token);
                    } catch (error) {
                        console.error('Error in verification callback:', error);
                    }
                }
            },
            'error-callback': () => {
                if (onError) {
                    try {
                        onError();
                    } catch (error) {
                        console.error('Error in error callback:', error);
                    }
                }
            },
            'expired-callback': () => {
                if (onExpire) {
                    try {
                        onExpire();
                    } catch (error) {
                        console.error('Error in expire callback:', error);
                    }
                }
            },
            theme,
            action
        };

        // Render the widget and store the ID for later reset
        try {
            widgetIdRef.current = windowWithTurnstile.turnstile.render(containerRef.current, options);
        } catch (error) {
            console.error('Error rendering Turnstile widget:', error);
            onError?.();
        }
    };

    // Called when the Turnstile script has loaded
    const handleScriptLoad = () => {
        setIsScriptLoaded(true);
    };

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
                async
                defer
                strategy="afterInteractive"
                onLoad={handleScriptLoad}
                onError={() => {
                    console.error('Failed to load Turnstile script');
                    onError?.();
                }}
            />
            <div id={id} ref={containerRef} className="cf-turnstile" />
        </>
    );
}

// Helper function to reset the Turnstile widget
export function resetTurnstile() {
    try {
        const windowWithTurnstile = window as WindowWithTurnstile;
        if (windowWithTurnstile.turnstile) {
            windowWithTurnstile.turnstile.reset();
        }
    } catch (error) {
        console.error('Error resetting Turnstile:', error);
    }
}