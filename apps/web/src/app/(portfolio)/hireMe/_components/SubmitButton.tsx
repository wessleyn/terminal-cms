'use client';
import { useEffect, useRef } from 'react';
import styles from './SubmitButton.module.css';

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
            className={`btn btn-primary btn-block w-100 ${styles.submitButton}`}
            disabled={pending}
        >
            {pending ? 'Sending...' : 'Submit Project Request'}
        </button>
    );
}
