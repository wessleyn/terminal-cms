'use client';

import Image from 'next/image';
import { FC, useState } from 'react';
import formatTag from './tagMapper';

export interface TechTagsProps {
    tags: string[];
    iconSize?: number;
    className?: string;
    gap?: number;
    limit?: number;
}

const TechTags: FC<TechTagsProps> = ({
    tags,
    iconSize = 32,
    className = '',
    gap = 2,
    limit
}) => {
    // Track errors for individual tags instead of a single global error state
    const [errorTags, setErrorTags] = useState<Record<string, boolean>>({});

    const tagsToShow = limit ? tags.slice(0, limit) : tags;
    const hasMoreTags = limit && tags.length > limit;

    // Individual tag rendering with error handling
    const renderTag = (tag: string, index: number) => {
        const formattedTag = formatTag(tag);
        const hasError = errorTags[tag] || false;

        return (
            <div
                key={index}
                className="tech-tag"
                title={tag}
                style={{
                    position: 'relative',
                    width: iconSize,
                    height: iconSize,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: hasError ? 'rgba(255,255,255,0.1)' : 'transparent',
                    borderRadius: '4px',
                    marginRight: '6px'
                }}
            >
                {hasError ? (
                    // Fallback when image fails to load - use SVG fallback or first letter
                    <span style={{ fontSize: iconSize / 2, color: 'rgba(255,255,255,0.7)' }}>
                        {tag[0]?.toUpperCase()}
                    </span>
                ) : (
                    <Image
                        alt={`${tag} icon`}
                        src={`https://skillicons.dev/icons?i=${formattedTag}`}
                        width={iconSize}
                        height={iconSize}
                        style={{ objectFit: 'contain' }}
                        onError={() => {
                            // Only mark this specific tag as having an error
                            setErrorTags(prev => ({ ...prev, [tag]: true }));
                        }}
                    />
                )}
            </div>
        );
    };

    return (
        <div className={`d-flex flex-wrap gap-${gap} ${className}`}>
            {tagsToShow.map((tag, index) => renderTag(tag, index))}

            {hasMoreTags && (
                <div
                    className="tech-tag-more"
                    title={`${tags.length - limit!} more technologies`}
                    style={{
                        width: iconSize,
                        height: iconSize,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        fontSize: iconSize / 2.5,
                        color: 'rgba(255,255,255,0.8)'
                    }}
                >
                    +{tags.length - limit!}
                </div>
            )}
        </div>
    );
};

export default TechTags;
