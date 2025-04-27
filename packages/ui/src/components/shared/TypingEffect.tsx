'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface TypingEffectProps {
    text: string | string[];
    typingSpeed?: number;
    delayBeforeTyping?: number;
    cursor?: boolean;
    className?: string;
    onComplete?: () => void;
}

const TypingEffect = ({
    text,
    typingSpeed = 100,
    delayBeforeTyping = 1000,
    cursor = true,
    className = '',
    onComplete,
}: TypingEffectProps) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const currentTextRef = useRef<string>('');
    const animationRef = useRef<NodeJS.Timeout | null>(null);

    // If text is an array, we'll just use the first item
    const phrase = useMemo(() => Array.isArray(text) ? text[0] : text, [text]);

    useEffect(() => {
        // Reset on props change
        currentTextRef.current = '';
        setDisplayText('');
        setIsComplete(false);

        if (animationRef.current) clearTimeout(animationRef.current);

        const animate = () => {
            const nextChar = phrase?.charAt(currentTextRef.current.length);

            if (nextChar) {
                // Still has characters to type
                currentTextRef.current += nextChar;
                setDisplayText(currentTextRef.current);
                animationRef.current = setTimeout(animate, typingSpeed);
            } else {
                // Finished typing
                setIsComplete(true);
                if (onComplete) onComplete();
            }
        };

        animationRef.current = setTimeout(animate, delayBeforeTyping);

        return () => {
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, [phrase, typingSpeed, delayBeforeTyping, onComplete]);

    return (
        <span className={className}>
            {displayText}
            {cursor && !isComplete && <span className="terminal-cursor">█</span>}
        </span>
    );
};

export default TypingEffect;
