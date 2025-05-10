"use client";

import dynamic from "next/dynamic";
import { AwesomePost } from "../../../_actions/fetchAwesomePost";
import TitleCommand from "../../../_components/TitleCommand";
import { ArticleCardSkeleton } from "./ArticleCardSkeleton";

// Dynamically import the ArticleCard component
const ArticleCard = dynamic(() => import("./ArticleCard"), {
  loading: () => <ArticleCardSkeleton />,
  ssr: false,
});

const AwesomeBlogPosts = ({ blogPosts }: { blogPosts: AwesomePost[] }) => {
  return (
    <div className="col">
      <TitleCommand
        title="ls -la ~/posts"
        hoverTitle="cd ~/posts"
        href="/blog/#recent"
      />
      <p className="mb-4">Below are some of my blogs</p>

      <div className="row gx-3 gy-4">
        {blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <div key={post.id} className="col-md-6">
              <ArticleCard post={post} />
            </div>
          ))
        ) : (
          <>
            <div className="col-md-6">
              <ArticleCardSkeleton />
            </div>
            <div className="col-md-6">
              <ArticleCardSkeleton />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AwesomeBlogPosts;