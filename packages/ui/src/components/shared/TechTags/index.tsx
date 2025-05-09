'use client';

import { Image } from '@mantine/core';
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
    const [loadError, setLoadError] = useState<boolean>(false);

    const tagsToShow = limit ? tags.slice(0, limit) : tags;
    const hasMoreTags = limit && tags.length > limit;



    // Individual tag rendering with error handling
    const renderTag = (tag: string, index: number) => {
        const formattedTag = formatTag(tag);

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
                    backgroundColor: loadError ? 'rgba(255,255,255,0.1)' : 'transparent',
                    borderRadius: '4px',
                    marginRight: '6px'
                }}
            >
                {loadError ? (
                    // Fallback when image fails to load
                    <span style={{ fontSize: iconSize / 2, color: 'rgba(255,255,255,0.7)' }}>
                        {tag[0]?.toUpperCase()}
                    </span>
                ) : (
                    <Image
                        alt={`${tag} icon`}
                        src={ `https://skillicons.dev/icons?i=${formattedTag}`}
                        width={iconSize}
                        height={iconSize}
                        style={{ objectFit: 'contain' }}
                        onError={() => setLoadError(true)}
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
