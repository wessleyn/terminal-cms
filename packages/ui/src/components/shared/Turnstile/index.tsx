'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

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

    // Initialize Turnstile when the script is loaded
    useEffect(() => {
        const windowWithTurnstile = window as WindowWithTurnstile;

        // If turnstile is already loaded, render it
        if (windowWithTurnstile.turnstile && containerRef.current) {
            renderTurnstile();
        }

        return () => {
            // Cleanup widget when component unmounts
            if (widgetIdRef.current) {
                const windowWithTurnstile = window as WindowWithTurnstile;
                windowWithTurnstile.turnstile?.reset(widgetIdRef.current);
            }
        };
    }, []);

    // Render Turnstile widget
    const renderTurnstile = () => {
        const windowWithTurnstile = window as WindowWithTurnstile;
        if (!containerRef.current || !windowWithTurnstile.turnstile) return;

        // Configuration for Turnstile
        const options: TurnstileOptions = {
            sitekey: siteKey,
            callback: (token) => onVerify?.(token),
            'error-callback': onError,
            'expired-callback': onExpire,
            theme,
            action
        };

        // Render the widget and store the ID for later reset
        widgetIdRef.current = windowWithTurnstile.turnstile.render(containerRef.current, options);
    };

    // Called when the Turnstile script has loaded
    const handleScriptLoad = () => {
        renderTurnstile();
    };

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                async
                defer
                strategy="afterInteractive"
                onLoad={handleScriptLoad}
            />
            <div id={id} ref={containerRef} className="cf-turnstile" />
        </>
    );
}

// Helper function to reset the Turnstile widget
export function resetTurnstile() {
    const windowWithTurnstile = window as WindowWithTurnstile;
    windowWithTurnstile.turnstile?.reset();
}