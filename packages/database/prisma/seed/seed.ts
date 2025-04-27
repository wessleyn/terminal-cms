import { PrismaClient } from '../../generated/prisma';
import { emailsData } from './data/emailData';
import { privacyData } from './data/privacyData';
import { projectsData } from './data/projectData';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.project.deleteMany();
    await prisma.emailSubscription.deleteMany();
    await prisma.privacy.deleteMany();

    // Seed projects
    for (const project of projectsData) {
        await prisma.project.create({
            data: project,
        });
    }

    // Seed email subscriptions
    for (const email of emailsData) {
        await prisma.emailSubscription.create({
            data: email,
        });
    }

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