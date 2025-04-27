'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const BlogBtn = () => {
    const pathname = usePathname();
    const isBlogPage = pathname.startsWith("/blog");

    return (
        <Link
            className="btn btn-lg btn-primary-dragient mt-3" role="button"
            href={isBlogPage ? "/" : "/blog"}>
            {isBlogPage ? "~/ cd root" : "~/ cd Blog"}
        </Link>
    )
}

export default BlogBtn