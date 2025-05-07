import { PrismaClient } from '../../generated/prisma';
import { blogAuthors, blogComments, blogPosts, blogTags } from './data/blogData';
import { meetingsData } from './data/meetingsData';
import { privacyData } from './data/privacyData';
import { profileData } from './data/profileData';
import { projectsData } from './data/projectData';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data - delete child records before parent records to avoid foreign key constraint violations
    await prisma.scheduledMeetingNote.deleteMany(); // Clear existing meeting notes first
    await prisma.scheduledMeeting.deleteMany(); // Then clear meetings
    await prisma.project.deleteMany();
    await prisma.portfolioProfileSocialLink.deleteMany(); // Delete social links first
    await prisma.portfolioProfileAvatar.deleteMany(); // Delete avatar links
    await prisma.portfolioProfile.deleteMany(); // Delete profile
    await prisma.privacySection.deleteMany(); // Delete sections first
    await prisma.privacy.deleteMany(); // Then delete privacy records
    await prisma.blogComment.deleteMany(); // Delete comments first
    await prisma.blogPost.deleteMany(); // Delete posts before authors
    await prisma.blogTag.deleteMany(); // Delete tags
    await prisma.blogAuthor.deleteMany(); // Delete authors last

    // Seed projects
    for (const project of projectsData) {
        await prisma.project.create({
            data: project,
        });
    }

    // Seed profile
    console.log('Seeding profile data...');

    const profile = await prisma.portfolioProfile.create({
        data: {
            displayName: profileData.name,
            workEmail: profileData.workEmail,
            tagline: profileData.tagline,
            description: profileData.description,
            currentAvatarIndex: profileData.currentAvatarIndex
        }
    });

    // Add profile avatars
    for (const avatar of profileData.avatars) {
        await prisma.portfolioProfileAvatar.create({
            data: {
                url: avatar,
                portfolioProfileId: profile.id
            }
        });
    }

    // Add social links
    await prisma.portfolioProfileSocialLink.create({
        data: {
            platform: 'github',
            url: profileData.socialLinks.github,
            portfolioProfileId: profile.id
        }
    });

    await prisma.portfolioProfileSocialLink.create({
        data: {
            platform: 'linkedin',
            url: profileData.socialLinks.linkedin,
            portfolioProfileId: profile.id
        }
    });

    await prisma.portfolioProfileSocialLink.create({
        data: {
            platform: 'twitter',
            url: profileData.socialLinks.twitter,
            portfolioProfileId: profile.id
        }
    });

    console.log('Profile data seeded successfully!');

    // Seed privacy policy
    console.log('Seeding privacy data...');

    // Create the main privacy document with all sections
    const privacy = await prisma.privacy.create({
        data: {
            type: privacyData.type,
            descPhrase: privacyData.descPhrase,
            // Create all the sections
            sections: {
                create: privacyData.sections
            }
        }
    });

    console.log(`Created privacy policy with ${privacyData.sections.length} sections.`);

    // Seed sample meetings
    console.log('Seeding sample meeting data...');
    for (const meeting of meetingsData) {
        const { meetingNotes, ...meetingData } = meeting;

        await prisma.scheduledMeeting.create({
            data: {
                ...meetingData,
                meetingNotes: {
                    create: meetingNotes.map((note: { note: any; }) => ({
                        note: note.note
                    }))
                }
            },
        });
    }
    console.log('Sample meeting data seeded successfully!');

    // Seed blog data
    console.log('Seeding blog data...');

    // Create blog authors
    console.log('Creating blog authors...');
    const authorMap = new Map();

    for (const author of blogAuthors) {
        const createdAuthor = await prisma.blogAuthor.create({
            data: author
        });
        authorMap.set(author.email, createdAuthor);
        console.log(`Created author: ${author.name}`);
    }

    // Create blog tags
    console.log('Creating blog tags...');
    const tagMap = new Map();

    for (const tag of blogTags) {
        const createdTag = await prisma.blogTag.create({
            data: tag
        });
        tagMap.set(tag.name, createdTag);
        console.log(`Created tag: ${tag.name}`);
    }

    // Create blog posts
    console.log('Creating blog posts...');
    const postMap = new Map();
    for (const post of blogPosts) {
        const { tags, authorEmail, ...postData } = post;

        // Find author by email
        const author = authorMap.get(authorEmail);

        if (!author) {
            console.warn(`Author with email ${authorEmail} not found, skipping post: ${post.title}`);
            continue;
        }

        // Get valid tag IDs before creating the post
        const validTagConnections: { id: string }[] = [];
        for (const tagName of tags) {
            const tag = tagMap.get(tagName);
            if (tag) {
                validTagConnections.push({ id: tag.id });
            } else {
                console.warn(`Tag '${tagName}' not found for post: ${post.title}`);
            }
        }

        // Create post with author and connect tags
        const createdPost = await prisma.blogPost.create({
            data: {
                ...postData,
                author: {
                    connect: { id: author.id }
                },
                tags: {
                    connect: validTagConnections
                }
            }
        });

        // Store the created post in the map with slug as key for easy comment association
        postMap.set(post.slug, createdPost);
        console.log(`Created post: ${post.title}`);
    }

    console.log('Blog data seeded successfully!');

    // Seed blog comments
    console.log('Creating blog comments...');
    for (const comment of blogComments) {
        const { replies, postId, ...commentData } = comment;

        // Find the post by slug
        const post = postMap.get(postId);

        if (!post) {
            console.warn(`Post with slug ${postId} not found, skipping comment: ${comment.id}`);
            continue;
        }

        // Create the parent comment
        const createdComment = await prisma.blogComment.create({
            data: {
                ...commentData,
                postId: post.id,
                parentId: null
            }
        });

        console.log(`Created comment: ${comment.id}`);

        // Create replies if any
        if (replies && replies.length > 0) {
            for (const reply of replies) {
                await prisma.blogComment.create({
                    data: {
                        ...reply,
                        postId: post.id,
                        parentId: createdComment.id
                    }
                });
                console.log(`Created reply to comment: ${comment.id}`);
            }
        }
    }

    console.log('Blog comments seeded successfully!');

    console.log('Database has been seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });