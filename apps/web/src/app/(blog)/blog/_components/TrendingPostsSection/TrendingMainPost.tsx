"use client";

import { Badge, Paper, Text } from "@mantine/core";
import Link from "next/link";
import { TrendingPost } from "../../_actions/getTrendingPosts";

interface TrendingMainPostProps {
  post: TrendingPost;
}

export default function TrendingMainPost({ post }: TrendingMainPostProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <Paper
        shadow="md"
        radius="md"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.7)), url(${post.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.transform = "translateY(-5px)";
          target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)";
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.transform = "translateY(0)";
          target.style.boxShadow = "";
        }}
      >
        <div style={{ padding: "30px" }}>
          <Badge color={post.category.color} mb="xs">
            {post.category.name}
          </Badge>
          <Text fw={700} size="xl" c="white">
            {post.title}
          </Text>
          <Text size="md" c="white" mt="sm">
            {post.excerpt}
          </Text>
          <Text size="sm" c="white" mt="md">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString()
              : "Coming soon"}
          </Text>
        </div>
      </Paper>
    </Link>
  );
}
