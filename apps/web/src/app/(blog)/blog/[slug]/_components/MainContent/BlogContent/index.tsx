'use client';

import { CodeHighlight } from '@mantine/code-highlight';
import { Anchor, Blockquote, Code, List, Paper, Table, Text, Title, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import Markdown from 'markdown-to-jsx';
import { slugify } from '../../../_utils/markdown';
interface BlogContentProps {
    content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = useMantineTheme();

    return (
        <Paper p="md" className="blog-content" bg="none">
            <Markdown
                options={{
                    overrides: {
                        h1: {
                            component: ({ children, ...props }) => {
                                const id = slugify(children?.toString() || '');
                                return (
                                    <Title
                                        id={id}
                                        order={1}
                                        mb="lg"
                                        mt="xl"
                                        size="h1"
                                        {...props}
                                    >
                                        {children}
                                    </Title>
                                );
                            }
                        },
                        h2: {
                            component: ({ children, ...props }) => {
                                const id = slugify(children?.toString() || '');
                                return (
                                    <Title
                                        id={id}
                                        order={2}
                                        mb="md"
                                        mt="xl"
                                        size="h2"
                                        {...props}
                                    >
                                        {children}
                                    </Title>
                                );
                            }
                        },
                        h3: {
                            component: ({ children, ...props }) => {
                                const id = slugify(children?.toString() || '');
                                return (
                                    <Title
                                        id={id}
                                        order={3}
                                        mb="sm"
                                        mt="lg"
                                        size="h3"
                                        {...props}
                                    >
                                        {children}
                                    </Title>
                                );
                            }
                        },
                        h4: {
                            component: ({ children, ...props }) => {
                                const id = slugify(children?.toString() || '');
                                return (
                                    <Title
                                        id={id}
                                        order={4}
                                        mb="sm"
                                        mt="md"
                                        size="h4"
                                        {...props}
                                    >
                                        {children}
                                    </Title>
                                );
                            }
                        },
                        p: {
                            component: Text,
                            props: {
                                mb: 'md',
                                size: 'lg',
                                lh: 1.7,
                            }
                        },
                        a: {
                            component: Anchor,
                            props: {
                                underline: 'hover',
                                target: '_blank',
                                rel: 'noopener noreferrer'
                            }
                        },
                        ul: {
                            component: List,
                            props: {
                                mb: 'md',
                                size: 'lg',
                                spacing: 'sm'
                            }
                        },
                        ol: {
                            component: List,
                            props: {
                                mb: 'md',
                                type: 'ordered',
                                size: 'lg',
                                spacing: 'sm'
                            }
                        },
                        li: {
                            component: List.Item
                        },
                        blockquote: {
                            component: Blockquote,
                            props: {
                                mb: 'md',
                                color: isDark ? 'blue.4' : 'blue.6',
                                iconSize: 30
                            }
                        },
                        table: {
                            component: Table,
                            props: {
                                mb: 'xl',
                                striped: true,
                                highlightOnHover: true,
                                withTableBorder: true,
                                withColumnBorders: false,
                            }
                        },
                        code: {
                            component: ({ className, children, ...props }) => {
                                const isCodeBlock = className?.includes('lang-');
                                console.log(isCodeBlock)
                                const language = className?.replace('lang-', '') || 'text';
                                console.log(language)

                                if (isCodeBlock) {
                                    // Use dynamically loaded component
                                    return (
                                        <CodeHighlight
                                            code={String(children)}
                                            language={language}
                                            withCopyButton
                                        />
                                    )
                                }

                                // Inline code
                                return (
                                    <Code
                                        bg={isDark ? 'dark.7' : 'gray.1'}
                                        color={isDark ? 'blue.3' : 'blue.7'}
                                        {...props}
                                    >
                                        {children}
                                    </Code>
                                );
                            }
                        },
                        img: {
                            props: {
                                style: {
                                    maxWidth: '100%',
                                    borderRadius: '0.5rem',
                                    margin: '1.5rem 0',
                                }
                            }
                        },
                        hr: {
                            props: {
                                style: {
                                    margin: '2rem 0',
                                    border: 'none',
                                    borderTop: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                                }
                            }
                        }
                    }
                }}
            >
                {content}
            </Markdown>
        </Paper>
    );
}
