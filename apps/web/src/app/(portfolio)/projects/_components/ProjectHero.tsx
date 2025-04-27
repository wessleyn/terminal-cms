'use client';

import { TypingEffect } from '@repo/ui/components/shared';
import { useEffect, useState } from 'react';

export default function ProjectHero() {
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCursor(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="terminal-section mb-5">
            <div className="terminal-command">
                <span className="terminal-prompt">$</span> cat projects/README.md
            </div>
            <div className="terminal-output">
                <h1 className="display-6 terminal-header-text mb-4">
                    <TypingEffect
                        text="My Projects"
                        typingSpeed={100}
                        delayBeforeTyping={300}
                    />
                    {showCursor && <span className="terminal-cursor"></span>}
                </h1>
                <p className="lead mb-4">
                    Explore my portfolio of projects. Each project demonstrates different technologies and problem-solving approaches.
                </p>
                <p>
                    Browse the gallery below to see my work, or filter projects by technology. Click on any project for more details.
                </p>
            </div>
        </div>
    );
}