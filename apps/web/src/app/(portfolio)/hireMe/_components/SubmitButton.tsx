'use client';
import { useEffect, useRef } from 'react';

interface SubmitButtonProps {
    pending?: boolean;
}

export function SubmitButton({ pending = false }: SubmitButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Apply background style immediately on component mount
    useEffect(() => {
        if (buttonRef.current) {
            // Force a reflow to ensure background is applied correctly
            const button = buttonRef.current;
            button.style.display = 'block';
            // Use void operator to trigger reflow without creating unused variable
            void button.offsetHeight;
            button.style.display = '';
        }
    }, []);

    return (
        <button
            ref={buttonRef}
            type="submit"
            className="btn btn-primary btn-block w-100"
            disabled={pending}
            style={{
                width: '100%',
                background: 'var(--bs-primary)',
                position: 'relative',
                transition: 'background-color 0.2s ease-in-out',
                border: '1px solid var(--bs-primary)',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                boxSizing: 'border-box',
                boxShadow: '0 0 0 1px var(--bs-primary)',
            }}
        >
            {pending ? 'Sending...' : 'Submit Project Request'}
        </button>
    );
}
