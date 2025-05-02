'use client';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { TechTagsProps } from '.';

export const TechTags: FC<TechTagsProps> = ({
    tags, iconSize = 32, className = '', gap = 2, limit
}) => {
    const [loadError, setLoadError] = useState<boolean>(false);
    const [batchedUrl, setBatchedUrl] = useState('');
    // Function to format tag names for skillicons
    const formatTag = (tag: string): string => {
        // Create a mapping for special cases
        const tagMap: Record<string, string> = {
            'Next.js': 'nextjs',
            'Node.js': 'nodejs',
            'Vue.js': 'vuejs',
            'React Native': 'react',
            'Tailwind CSS': 'tailwind',
            'Styled Components': 'styledcomponents',
            'Express': 'express',
            'MongoDB': 'mongodb',
            'PostgreSQL': 'postgresql',
            'GraphQL': 'graphql',
            'Material UI': 'materialui',
            'Firebase': 'firebase',
            'TypeScript': 'ts',
            'JavaScript': 'js',
            'CSS': 'css',
            'HTML': 'html',
            'Docker': 'docker',
            'AWS': 'aws',
            'Bootstrap': 'bootstrap',
            'Redux': 'redux',
            'Git': 'git',
            'GitHub': 'github',
            'Angular': 'angular',
            'PHP': 'php',
            'Python': 'python',
            'Java': 'java',
        };

        // Return the mapped tag or format it correctly
        return tagMap[tag] || tag.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
    };

    const tagsToShow = limit ? tags.slice(0, limit) : tags;
    const hasMoreTags = limit && tags.length > limit;

    // If we have many tags, build a batched request URL
    // const [batchedUrl, setBatchedUrl] = useState<string>('');
    useEffect(() => {
        if (tagsToShow.length > 0) {
            // Create a batched request for all icons at once
            const formattedTags = tagsToShow.map(tag => formatTag(tag));
            const uniqueTags = Array.from(new Set(formattedTags));
            setBatchedUrl(`https://skillicons.dev/icons?i=${uniqueTags.join(',')}`);
        }
    }, [tagsToShow]);

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
                        {tag[0] && tag[0].toUpperCase()}
                    </span>
                ) : (
                    <Image
                        alt={`${tag} icon`}
                        src={batchedUrl ? `${batchedUrl}&perline=${tagsToShow.length}` : `https://skillicons.dev/icons?i=${formattedTag}`}
                        width={iconSize}
                        height={iconSize}
                        style={{ objectFit: 'contain' }}
                        onError={() => setLoadError(true)} />
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
