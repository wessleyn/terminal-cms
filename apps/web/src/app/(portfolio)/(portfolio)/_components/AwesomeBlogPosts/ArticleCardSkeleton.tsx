"use client";
import { Skeleton } from "../../../../../../../../packages/ui/src/components/mantine";

// Create an ArticleCardSkeleton component
export const ArticleCardSkeleton = () => (
    <Skeleton style={{ height: "280px" }} className="bg-dark w-full" />
);
