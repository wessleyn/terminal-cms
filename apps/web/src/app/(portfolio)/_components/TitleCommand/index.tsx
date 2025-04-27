'use client';

import { useHover } from '@mantine/hooks';
import Link from 'next/link';
import { FC } from 'react';

interface TitleCommandProps {
    title: string;
    hoverTitle: string;
    href: string;
}
// TODO: retype the title when hovered
const TitleCommand: FC<TitleCommandProps> = ({ title, hoverTitle, href }) => {
    const { hovered, ref } = useHover();

    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <h2
                ref={ref}
                className="fs-3 fw-bold text-primary terminal-cursor"
                style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
            >
                $ {hovered ? hoverTitle : title}
            </h2>
        </Link>
    );
};

export default TitleCommand;
