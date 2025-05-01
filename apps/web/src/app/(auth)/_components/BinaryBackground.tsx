'use client'

import { useEffect, useRef } from 'react';
import styles from './BinaryBackground.module.css';

interface BinaryBackgroundProps {
    density?: number; // Controls how many binary digits appear (1-10)
    speed?: number; // Animation speed (1-10)
}

export default function BinaryBackground({
    density = 5,
    speed = 3
}: BinaryBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas to fill the screen
        const resizeCanvas = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Binary rain settings
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const scaledDensity = Math.min(Math.max(density, 1), 10);
        const drops: number[] = [];

        // Initialize drops at random positions
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * canvas.height);
        }

        // Calculate speed in milliseconds (higher number = slower)
        const animationSpeed = Math.floor(120 - (speed * 10));

        // Draw function
        const draw = () => {
            if (!canvas || !ctx) return;

            // Semi-transparent black to create fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Green text
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Choose randomly between 0 and 1
                const text = Math.random() > 0.5 ? '1' : '0';

                // Draw the character
                ctx.fillText(text, i * fontSize, (drops[i] ?? 0) * fontSize);

                // Reset position when reaching bottom or randomly
                if ((drops[i] ?? 0) * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Move drops down at varying speeds based on position
                drops[i] = (drops[i] ?? 0) + (Math.random() * 0.5) + 0.1 * (scaledDensity / 5);
            }
        };

        // Start animation
        const interval = setInterval(draw, animationSpeed);

        // Cleanup
        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [density, speed]);

    return (
        <canvas
            ref={canvasRef}
            className={styles.binaryBackground}
            aria-hidden="true"
        />
    );
}