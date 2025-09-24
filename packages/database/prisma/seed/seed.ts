import { PrismaClient } from '../../generated/prisma';
import { blogComments, blogPosts, blogTags } from './data/blogData';
import { blogPrivacyData, privacyData } from './data/privacyData';
import { profileData } from './data/profileData';
import { projectsData } from './data/projectData';
import { userData } from './data/userData';
import { meetingsData } from './data/meetingsData';
import { termsData } from './data/privacyData';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.scheduledMeetingNote.deleteMany();
    await prisma.scheduledMeeting.deleteMany();
    await prisma.project.deleteMany();
    await prisma.portfolioProfileSocialLink.deleteMany(); 
    await prisma.portfolioProfileAvatar.deleteMany(); 
    await prisma.session.deleteMany(); 
    await prisma.user.deleteMany(); 
    await prisma.categorySubscriber.deleteMany(); 
    await prisma.blogPost.deleteMany(); 
    await prisma.blogCategory.deleteMany(); 
    await prisma.portfolioProfile.deleteMany();
    await prisma.privacySection.deleteMany();
    await prisma.privacy.deleteMany();
    await prisma.blogComment.deleteMany();
    await prisma.blogTag.deleteMany();

    // Seed projects
    for (const project of projectsData) {
        const { engagement, ...projectData } = project;

        const projectId = crypto.randomUUID();

        await prisma.projectEngagement.create({
            data: {
                id: projectId,
                shares: engagement.share || 0,
                bookmarks: engagement.bookmark || 0,
                likes: engagement.like || 0,
            }
        });

        await prisma.project.create({
            data: {
                id: projectId,
                ...projectData,
                projectType: projectData.featured ? 'FEATURED' : 'SOLO'
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

    for (const avatar of profileData.avatars) {
        await prisma.portfolioProfileAvatar.create({
            data: {
                url: avatar,
                portfolioProfileId: profile.id,
                isActive: avatar === profileData.avatars[0]
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
                role: user.role || 'USER',
            }
        });
        console.log(`Created user: ${user.name}`);
    }

    console.log('User data seeded successfully!');

    // Seed privacy policy
    console.log('Seeding privacy data...');

    await prisma.privacy.create({
        data: {
            type: privacyData.type,
            descPhrase: privacyData.descPhrase,
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

        const validTagConnections: { id: string }[] = [];
        for (const tagName of tags) {
            const tag = tagMap.get(tagName);
            if (tag) {
                validTagConnections.push({ id: tag.id });
            } else {
                console.warn(`Tag '${tagName}' not found for post: ${post.title}`);
            }
        }

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
                    connect: { id: profile!.id }
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

        const post = postMap.get(postId);

        if (!post) {
            console.warn(`Post with slug ${postId} not found, skipping comment: ${comment.id}`);
            continue;
        }

        const createdComment = await prisma.blogComment.create({
            data: {
                ...commentData,
                postId: post.id,
                parentId: null,
                authorProfile: "default"
            }
        });

        console.log(`Created comment: ${comment.id}`);

        if (replies && replies.length > 0) {
            for (const reply of replies) {
                await prisma.blogComment.create({
                    data: {
                        ...reply,
                        postId: post.id,
                        parentId: createdComment.id,
                        authorProfile: "default"
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