'use client';

import { CodeHighlightTabs } from '@mantine/code-highlight';
// Import only CSS styles
import '@mantine/code-highlight/styles.css';

// Import highlight.js directly instead of individual language modules
import hljs from 'highlight.js/lib/core';
// Register only the languages you need
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

// Register the languages with highlight.js
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml); // XML is used for HTML

// Define available languages map to use with the component
const availableLanguages: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    javascript: 'javascript',
    typescript: 'typescript',
    json: 'json',
    bash: 'bash',
    sh: 'bash',
    shell: 'bash',
    css: 'css',
    md: 'markdown',
    markdown: 'markdown',
    html: 'xml',
    xml: 'xml',
    text: 'text',
};

interface CodeHighlighterProps {
    code: string;
    language: string;
    withCopyButton?: boolean;
    fileName?: string;
}

export function CodeHighlighter({
    code,
    language = 'text',
    withCopyButton = true,
    fileName,
}: CodeHighlighterProps) {
    // Normalize language key
    const normalizedLang = language.toLowerCase();
    const usedLanguage = normalizedLang in availableLanguages
        ? availableLanguages[normalizedLang]
        : 'text';

    // If we have a filename, show tabs
    if (fileName) {
        return (
            <CodeHighlightTabs
                code={[{ fileName, code, language: usedLanguage }]}
                withCopyButton={withCopyButton}
            />
        );
    }

    // Otherwise just show the code block
    return (
        <CodeHighlightTabs
            code={[{ code, language: usedLanguage }]}
            withCopyButton={withCopyButton}
        />
    );
}