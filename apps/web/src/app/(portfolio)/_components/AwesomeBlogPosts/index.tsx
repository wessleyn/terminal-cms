'use client'

import { Skeleton } from "@mantine/core"
import { AwesomePost } from "../../_actions/fetchAwesomePost"
import TitleCommand from "../TitleCommand"
import ArticleCard from "./ArticleCard"
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
              <Skeleton style={{ height: '280px' }} className="bg-dark w-full" />
            </div>
            <div className="col-md-6">
              <Skeleton style={{ height: '280px' }} className="bg-dark w-full" />
            </div>
          </>
        )}
      </div>
    </div>  )
}

export default AwesomeBlogPosts