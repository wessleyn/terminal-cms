'use client'

import { BlogComment, BlogTag } from "@repo/db"
import { Badge, Container, Grid, Group, Text } from "@repo/ui/components/mantine"
import { Suspense } from "react"
import BlogSidebar from "../BlogSidebar"
import BlogContent from "./BlogContent"
import DynamicComments from "./Comments/DynamicComments"

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
}

const MainContent = ({ post }: MainContentProps) => {
    return (
        <Container size="xl" py="xl" px='xl'>
            <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <BlogContent content={post.content} />

                    <div style={{ paddingTop: '2rem' }}>
                        <Group gap="md">
                            <div>
                                <Text fw={500} span>Category:</Text>{" "}
                                <Badge variant="light" color="green">{post.category}</Badge>
                            </div>

                            <div>
                                <Text fw={500} span>Tags:</Text>{" "}
                                <Group gap="xs" display="inline-flex">
                                    {post.tags.map((tag: BlogTag) => (
                                        <Badge key={tag.id} radius="sm" variant="outline">
                                            #{tag.name}
                                        </Badge>
                                    ))}
                                </Group>
                            </div>
                        </Group>
                    </div>

                    {/* Dynamic comments section with Suspense for loading state */}
                    <Suspense fallback={
                        <div className="comments-loading">
                            <Text ta="center" c="dimmed" py="xl">Loading comments...</Text>
                        </div>
                    }>
                        <DynamicComments
                            postId={post.id}
                            slug={post.slug}
                        />
                    </Suspense>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <BlogSidebar />
                </Grid.Col>
            </Grid>
        </Container>
    );
}

export default MainContent