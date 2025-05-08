'use client'

import { BlogComment, BlogTag } from "@repo/db"
import { Badge, Container, Grid, Group, Text } from "@repo/ui/components/mantine"
import dynamic from 'next/dynamic'
import Link from "next/link"
import BlogContent from "./BlogContent"

// Import the DynamicComments as a dynamic component with SSR enabled
const DynamicComments = dynamic(() => import('./Comments/index'), {
    ssr: true, // Make sure SSR is enabled for the dynamic component
    loading: () => (
        <div className="comments-loading">
            <Text ta="center" c="dimmed" py="xl">Loading comments...</Text>
        </div>
    )
});

interface PostType {
    content: string;
    category: string;
    tags: BlogTag[];
    comments?: BlogComment[];
    id: string;
    title: string;
    slug: string;
}

interface MainContentProps {
    post: PostType;
    children: React.ReactNode;
}

const MainContent = ({ post, children }: MainContentProps) => {
    return (
        <Container size="xl" py="xl" px='xl'>
            <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <BlogContent content={post.content} />

                    <div style={{ paddingTop: '2rem' }}>
                        <Group gap="md">
                            <div>
                                <Text fw={500} span>Category:</Text>{" "}
                                <Link href={`/blog/category/${post.category.toLowerCase()}`} passHref>
                                    <Badge variant="light" color="green">{post.category}</Badge>
                                </Link>
                            </div>

                            <div>
                                <Text fw={500} span>Tags:</Text>{" "}
                                <Group gap="xs" display="inline-flex">
                                    {post.tags.map((tag: BlogTag) => (
                                        <Link href={`/blog/tag/${tag.name.toLowerCase()}`} passHref key={tag.id}>
                                            <Badge key={tag.id} radius="sm" variant="outline">
                                                #{tag.name}
                                            </Badge>
                                        </Link>
                                    ))}
                                </Group>
                            </div>
                        </Group>
                    </div>

                    {/* Use next/dynamic to load the comments section */}
                    <DynamicComments
                        postId={post.id}
                        slug={post.slug}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                   {children}
                </Grid.Col>
            </Grid>
        </Container>
    );
}

export default MainContent