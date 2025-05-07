'use client'
import { Avatar, AvatarProps } from '@repo/ui/components/mantine'

const BlogLogo = (props: AvatarProps) => {
    return (
        <Avatar
            src='/profile.jpg'
            alt='Picture'
            radius="xl"
            size={'md'}
            {...props}
        />
    )
}

export default BlogLogo