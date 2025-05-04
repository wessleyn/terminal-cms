import { PrismaClient } from '../../generated/prisma';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                    create: meetingNotes.map(note => ({
                        note: note.note
                    }))
                }
            },
        });
    }
    console.log('Sample meeting data seeded successfully!');

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