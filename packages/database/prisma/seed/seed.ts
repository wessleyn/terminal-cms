import crypto from 'crypto';
import { PrismaClient } from '../../generated/prisma';
import { blogComments, blogPosts, blogTags } from './data/blogData';
import { meetingsData } from './data/meetingsData';
import { blogPrivacyData, privacyData, termsData } from './data/privacyData';
import { profileData } from './data/profileData';
import { projectsData } from './data/projectData';
import { userData } from './data/userData';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data - delete child records before parent records to avoid foreign key constraint violations
    await prisma.scheduledMeetingNote.deleteMany(); // Clear existing meeting notes first
    await prisma.scheduledMeeting.deleteMany(); // Then clear meetings
    await prisma.project.deleteMany();
    await prisma.portfolioProfileSocialLink.deleteMany(); // Delete social links first
    await prisma.portfolioProfileAvatar.deleteMany(); // Delete avatar links
    await prisma.session.deleteMany(); // Clear sessions before users
    await prisma.user.deleteMany(); // Clear users
    await prisma.categorySubscriber.deleteMany(); // Delete category subscribers
    await prisma.blogPost.deleteMany(); // Delete posts before categories
    await prisma.blogCategory.deleteMany(); // Delete categories
    await prisma.portfolioProfile.deleteMany(); // Delete profile
    await prisma.privacySection.deleteMany(); // Delete sections first
    await prisma.privacy.deleteMany(); // Then delete privacy records
    await prisma.blogComment.deleteMany(); // Delete comments first
    await prisma.blogTag.deleteMany(); // Delete tags

    // Seed projects
    for (const project of projectsData) {
        const { engagement, ...projectData } = project;

        // Generate a UUID for both Project and ProjectEngagement
        const projectId = crypto.randomUUID();

        // Create ProjectEngagement first
        await prisma.projectEngagement.create({
            data: {
                id: projectId,
                shares: engagement.share || 0,
                bookmarks: engagement.bookmark || 0,
                likes: engagement.like || 0,
            }
        });

        // Then create Project with same ID to maintain relationship
        await prisma.project.create({
            data: {
                id: projectId,
                ...projectData,
                projectType: projectData.featured ? 'FEATURED' : 'SOLO' // Map featured flag to projectType enum
            },
        });
    }

    // Seed profile
    console.log('Seeding profile data...');

    const profile = await prisma.portfolioProfile.create({
        data: {
            displayName: profileData.name,
            workEmail: profileData.workEmail,
            tagline: profileData.tagline,
            bio: profileData.description,
        }
    });

    // Add profile avatars
    for (const avatar of profileData.avatars) {
        await prisma.portfolioProfileAvatar.create({
            data: {
                url: avatar,
                portfolioProfileId: profile.id,
                isActive: avatar === profileData.avatars[0] // Set the first avatar as active
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

    // Seed users data
    console.log('Seeding user data...');

    for (const user of userData) {
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role || 'USER', // Default to USER role if not specified
            }
        });
        console.log(`Created user: ${user.name}`);
    }

    console.log('User data seeded successfully!');

    // Seed privacy policy
    console.log('Seeding privacy data...');

    // Create the portfolio privacy document with all sections
    await prisma.privacy.create({
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

    // Create the blog privacy document
    await prisma.privacy.create({
        data: {
            type: blogPrivacyData.type,
            descPhrase: blogPrivacyData.descPhrase,
            // Create all the sections
            sections: {
                create: blogPrivacyData.sections
            }
        }
    });

    console.log(`Created blog privacy policy with ${blogPrivacyData.sections.length} sections.`);

    // Create the terms of service document
    await prisma.privacy.create({
        data: {
            type: termsData.type,
            descPhrase: termsData.descPhrase,
            // Create all the sections
            sections: {
                create: termsData.sections
            }
        }
    });

    console.log(`Created terms of service with ${termsData.sections.length} sections.`);

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

    // Create blog categories (replacing the old enum)
    console.log('Creating blog categories...');
    const categories = [
        { name: 'Spells', slug: 'spells', color: 'purple', description: 'Magical incantations and rituals' },
        { name: 'Potions', slug: 'potions', color: 'green', description: 'Brewed concoctions with magical properties' },
        { name: 'Scrolls', slug: 'scrolls', color: 'blue', description: 'Written magical texts and documents' },
        { name: 'Artifacts', slug: 'artifacts', color: 'orange', description: 'Magical items and relics' }
    ];

    const categoryMap = new Map();

    for (const category of categories) {
        const createdCategory = await prisma.blogCategory.create({
            data: category
        });
        categoryMap.set(category.slug.toUpperCase(), createdCategory);
        console.log(`Created category: ${category.name}`);
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
        const { tags, category, ...postData } = post;

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

        // Map the old enum category to the new category model
        const categoryObj = categoryMap.get(category);
        if (!categoryObj) {
            console.warn(`Category '${category}' not found for post: ${post.title}`);
            continue;
        }

        // Create post with author, category, and connect tags
        const createdPost = await prisma.blogPost.create({
            data: {
                ...postData,
                author: {
                    connect: { id: profile.id }
                },
                category: {
                    connect: { id: categoryObj.id }
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
                parentId: null,
                authorProfile: "default" // Adding the required authorProfile field
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
                        parentId: createdComment.id,
                        authorProfile: "default" // Adding the required authorProfile field
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