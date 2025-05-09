import '@mantine/code-highlight/styles.css';
import { Metadata } from 'next';
import Footer from './_components/Footer';
import Header from './_components/Header';
import classes from './layout.module.css';

// Using environment variables for URLs in metadata
const baseUrl = process.env.WEB_PUBLIC_URL || 'https://localhost:3000';
const blogUrl = `${baseUrl}/blog`;

export const metadata: Metadata = {
    title: {
        default: 'Terminal Blog',
        template: '%s | Terminal Blog',
    },
    description: 'Tech articles and coding insights by Wessley N',
    alternates: {
        canonical: blogUrl,
        types: {
            'application/rss+xml': `${blogUrl}/feed.xml`,
        },
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className={classes.pageLayout}>
            <header className={classes.header}>
                <Header />
            </header>
            <main className={classes.mainContent}>{children}</main>
            <Footer />
        </div>
    );
}