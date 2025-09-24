import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="text-center">
            <div className="container text-muted py-4 py-lg-5">
                <ul className="list-inline d-flex justify-content-center flex-wrap gap-4 mb-3">
                    <li className="list-inline-item"><Link href="/">~/home</Link></li>
                    <li className="list-inline-item"><Link href="/blog">~/blog</Link></li>
                    <li className="list-inline-item"><Link href="/projects">~/projects</Link></li>
                    <li className="list-inline-item"><Link href="/hireMe">~/hireMe</Link></li>
                    <li className="list-inline-item"><Link href="/privacy">~/privacy</Link></li>
                </ul>
                <p className="mb-0 small">echo &quot;Copyright © 2025 Wessley Nyakanyanga&quot;</p>
            </div>
        </footer>
    )
}

export default Footer;
