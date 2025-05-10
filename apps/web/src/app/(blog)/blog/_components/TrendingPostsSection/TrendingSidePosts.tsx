"use client";

import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { TrendingPost } from "../../_actions/getTrendingPosts";

interface TrendingSidePostsProps {
  posts: TrendingPost[];
}

export default function TrendingSidePosts({ posts }: TrendingSidePostsProps) {
  // Ensure we have exactly 3 posts
  const sidePosts = [...posts];
  const defaultPost: TrendingPost = {
    id: "0",
    title: "Loading...",
    slug: "",
    excerpt: "", // Add required excerpt field
    category: {  // Update to use the new category structure
      name: "Default",
      slug: "default",
      color: "blue"
    },
    imageUrl: "/placeholder.jpg",
    publishedAt: null,
    author: null,
    tags: []
  };

  while (sidePosts.length < 3) {
    sidePosts.push({ ...defaultPost, id: `default-${sidePosts.length}` });
  }

  // Create safe post references that are guaranteed to exist
  const post1 = sidePosts[0] || defaultPost;
  const post2 = sidePosts[1] || defaultPost;
  const post3 = sidePosts[2] || defaultPost;

  return (
    <Stack style={{ height: "100%", width: "100%" }} gap="md">
      <Link
        href={post1.slug ? `/blog/${post1.slug}` : "#"}
        style={{
          textDecoration: "none",
          display: "block",
          height: 190,
          width: "100%",
        }}
      >
        <Paper
          shadow="md"
          radius="md"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post1.imageUrl || "/placeholder.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: post1.slug ? "pointer" : "default",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ padding: "20px" }}>
            <Badge color={post1.category.color} mb="xs">
              {post1.category.name}
            </Badge>
            <Text fw={700} c="white">
              {post1.title}
            </Text>
            <Text size="sm" c="white" mt="xs">
              {post1.publishedAt
                ? new Date(post1.publishedAt).toLocaleDateString()
                : "Coming soon"}
            </Text>
          </div>
        </Paper>
      </Link>

      <Group style={{ width: "100%", gap: "var(--mantine-spacing-md)" }}>
        <Link
          href={post2.slug ? `/blog/${post2.slug}` : "#"}
          style={{
            textDecoration: "none",
            display: "block",
            height: 190,
            flex: 1,
          }}
        >
          <Paper
            shadow="md"
            radius="md"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post2.imageUrl || "/placeholder.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: post2.slug ? "pointer" : "default",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ padding: "15px" }}>
              <Badge color={post2.category.color} mb="xs" size="sm">
                {post2.category.name}
              </Badge>
              <Text fw={700} size="sm" c="white">
                {post2.title}
              </Text>
              <Text size="xs" c="white" mt="xs">
                {post2.publishedAt
                  ? new Date(post2.publishedAt).toLocaleDateString()
                  : "Coming soon"}
              </Text>
            </div>
          </Paper>
        </Link>

        <Link
          href={post3.slug ? `/blog/${post3.slug}` : "#"}
          style={{
            textDecoration: "none",
            display: "block",
            height: 190,
            flex: 1,
          }}
        >
          <Paper
            shadow="md"
            radius="md"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${post3.imageUrl || "/placeholder.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: post3.slug ? "pointer" : "default",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ padding: "15px" }}>
              <Badge color={post3.category.color} mb="xs" size="sm">
                {post3.category.name}
              </Badge>
              <Text fw={700} size="sm" c="white">
                {post3.title}
              </Text>
              <Text size="xs" c="white" mt="xs">
                {post3.publishedAt
                  ? new Date(post3.publishedAt).toLocaleDateString()
                  : "Coming soon"}
              </Text>
            </div>
          </Paper>
        </Link>
      </Group>
    </Stack>
  );
}
