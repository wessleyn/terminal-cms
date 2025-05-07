'use client';

import UniversalNewsletter from "../../_components/UniversalNewsletter";


export default function Newsletter({ postId }: { postId: string }) {
    return (
        <UniversalNewsletter
            type="post"
            postId={postId}
            title="Subscribe to this post"
            subtitle="Get notified about updates and follow-ups to this article."
        />
    );
}
