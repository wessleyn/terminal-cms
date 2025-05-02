'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import classes from "./ProfileInfo.module.css";

const HireMeBtn = () => {
    const pathname = usePathname();
    const isHireMePage = pathname === "/hireMe";

    return (
        <Link
            className={classes.btn} role="button"
            href={isHireMePage ? "/" : "/hireMe"}>
            {isHireMePage ? "~/ cd root" : "~/ cd Hire me"}
        </Link>
    )
}

export default HireMeBtn