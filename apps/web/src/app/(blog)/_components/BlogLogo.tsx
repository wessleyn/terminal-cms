'use client';

import { Avatar, AvatarProps } from '@mantine/core';
import Link from 'next/link';

const BlogLogo = (props: AvatarProps) => {
    return (
        <Link href='/'>
            <Avatar
                src='/profile.jpg'
                alt='Picture'
                radius="xl"
                size={'md'}
                {...props}
            />
        </Link>
    )
}

export default BlogLogo