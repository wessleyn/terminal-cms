'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface TagInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
    tags,
    onTagsChange,
    suggestions = [],
    placeholder = "Add tag..."
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentInput, setCurrentInput] = useState<string>('');
    const [previewTag, setPreviewTag] = useState<string | null>(null);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

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
        };

        // Return the mapped tag or format it correctly
        return tagMap[tag] || tag.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
    };

    // Update filtered suggestions when input changes
    useEffect(() => {
        if (currentInput) {
            const filtered = suggestions.filter(
                suggestion => !tags.includes(suggestion) &&
                    suggestion.toLowerCase().includes(currentInput.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions(suggestions.filter(tag => !tags.includes(tag)).slice(0, 8));
        }
    }, [currentInput, suggestions, tags]);

    const addTag = (tag: string) => {
        if (tag && !tags.includes(tag)) {
            onTagsChange([...tags, tag]);
            setCurrentInput('');
            setPreviewTag(null);
            if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.focus();
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        onTagsChange(newTags);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentInput(e.target.value);
        setPreviewTag(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentInput) {
                addTag(currentInput);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (currentInput) {
                // Instead of immediately adding the tag, show a preview
                setPreviewTag(currentInput);
            }
        } else if (e.key === 'Backspace' && !currentInput && tags.length > 0) {
            // Remove the last tag when backspace is pressed in an empty input
            const newTags = [...tags];
            newTags.pop();
            onTagsChange(newTags);
        }
    };

    return (
        <div className="tag-input-container">
            <div className="d-flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="terminal-tag position-relative d-flex align-items-center"
                        style={{
                            marginBottom: '10px',
                            marginRight: '10px',
                            padding: '4px 8px 4px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.1)'
                        }}
                    >
                        <div className="d-flex align-items-center">
                            {/* Use a div with background color as fallback */}
                            <div
                                style={{
                                    width: 16,
                                    height: 16,
                                    marginRight: 6,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '3px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '9px',
                                    color: 'rgba(255,255,255,0.7)',
                                    overflow: 'hidden'
                                }}
                            >
                                <Image
                                    alt={`${tag} icon`}
                                    src={`https://skillicons.dev/icons?i=${formatTag(tag)}`}
                                    width={16}
                                    height={16}
                                    className="me-0"
                                    onError={(e) => {
                                        // When image fails to load, show just the first letter as fallback
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        (target.parentElement as HTMLElement).innerText = tag[0] ? tag[0].toUpperCase() : '';
                                    }}
                                />
                            </div>
                            <span style={{ fontSize: '13px' }}>{tag}</span>
                        </div>
                        <button
                            className="tag-remove-btn"
                            style={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                background: 'rgba(0,0,0,0.5)',
                                border: 'none',
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '14px',
                                cursor: 'pointer',
                                padding: '0 4px',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                lineHeight: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => removeTag(tag)}
                        >
                            ×
                        </button>
                    </div>
                ))}

                <div className="position-relative d-inline-block" style={{ marginBottom: '10px' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="tag-input"
                        placeholder={placeholder}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'inherit',
                            padding: '4px 8px',
                            width: '120px',
                            outline: 'none'
                        }}
                    />

                    {/* Preview area that shows when Tab is pressed */}
                    {previewTag && (
                        <div className="tag-preview position-absolute start-0 top-100 mt-1 p-2 rounded bg-dark border border-secondary">
                            <div className="d-flex flex-column align-items-center">
                                <Image
                                    alt={`${previewTag} preview`}
                                    src={`https://skillicons.dev/icons?i=${formatTag(previewTag)}`}
                                    width={24}
                                    height={24}
                                    className="mb-1"
                                />
                                <small className="text-muted">Press Enter to add</small>
                                <div className="d-flex gap-2 mt-1">
                                    <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => addTag(previewTag)}
                                    >
                                        Add
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => {
                                            setPreviewTag(null);
                                            if (inputRef.current) {
                                                inputRef.current.focus();
                                            }
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {filteredSuggestions.length > 0 && (
                <div className="tag-suggestions mb-3">
                    <small className="text-muted d-block mb-2">Suggestions:</small>
                    <div className="d-flex flex-wrap gap-2">
                        {filteredSuggestions.slice(0, 8).map((suggestion) => (
                            <div
                                key={suggestion}
                                className="terminal-tag suggestion-tag d-flex align-items-center"
                                onClick={() => addTag(suggestion)}
                                style={{
                                    cursor: 'pointer',
                                    opacity: 0.7,
                                    padding: '3px 8px',
                                    marginRight: '5px',
                                    marginBottom: '5px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '4px'
                                }}
                            >
                                <div
                                    style={{
                                        width: 16,
                                        height: 16,
                                        marginRight: 6,
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '3px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '9px',
                                        color: 'rgba(255,255,255,0.7)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <span>{suggestion[0] ? suggestion[0].toUpperCase() : ''}</span>
                                </div>
                                <span style={{ fontSize: '13px' }}>{suggestion}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagInput;
