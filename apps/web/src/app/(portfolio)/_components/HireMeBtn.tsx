'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const HireMeBtn = () => {
    const pathname = usePathname();
    const isHireMePage = pathname === "/hireMe";

    return (
        <Link
            className="btn btn-lg btn-primary-dragient mt-3" role="button"
            href={isHireMePage ? "/" : "/hireMe"}>
            {isHireMePage ? "~/ cd root" : "~/ cd Hire me"}
        </Link>
    )
}

export default HireMeBtn