import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="text-center">
            <div className="container text-muted py-4 py-lg-5">
                <ul className="list-inline">
                    <li className="list-inline-item me-4"><Link href="/">~/home</Link></li>
                    <li className="list-inline-item me-4"><Link href="/blog">~/blog</Link></li>
                    <li className="list-inline-item me-4"><Link href="/projects">~/projects</Link></li>
                    <li className="list-inline-item me-4"><Link href="/privacy">~/privacy</Link></li>
                    <li className="list-inline-item"><Link href="/hireMe">~/hireMe</Link></li>
                </ul>
                <p className="mb-0">echo &quot;Copyright © 2025 Wessley Nyakanyanga&quot;</p>
            </div>
        </footer>
    )
}

export default Footer