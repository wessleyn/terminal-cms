'use client'

import Header from './_components/Header';
import classes from './layout.module.css';
import '@mantine/code-highlight/styles.css';

export default function BlogLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <header className={classes.header}>
                <Header />
            </header>
            <main>{children}</main>
            <footer className={classes.footer}>
                {/* Footer content goes here */}
            </footer>
        </>
    );
}