// Sample meetings data for seeding the database
import { MeetingStatus } from "../../../generated/prisma";

export const meetingsData = [
    {
        clientName: "Alex Johnson",
        clientEmail: "alex@example.com",
        projectName: "E-commerce Website Redesign",
        projectBudget: "$3,000-$5,000",
        projectDescription: "We need to redesign our online store to improve user experience and increase conversion rates. The current website is outdated and not mobile-friendly. We're looking for a complete overhaul with modern design and improved checkout flow.",
        scheduleMeetingDate: new Date(2025, 4, 10, 14, 30), // May 10, 2025, 2:30 PM
        status: MeetingStatus.CONFIRMED,
        meetingNotes: [
            {
                note: "Client wants to focus on mobile responsiveness and faster checkout process. Should prepare examples of recent e-commerce projects.",
            }
        ]
    },
    {
        clientName: "Sarah Miller",
        clientEmail: "sarah.miller@company.org",
        projectName: "Mobile App Development",
        projectBudget: "$8,000-$12,000",
        projectDescription: "We're a fitness startup looking to develop a mobile app for tracking workouts and nutrition. We need both iOS and Android versions with user authentication, profile management, workout logging, and social sharing features.",
        scheduleMeetingDate: new Date(2025, 4, 15, 10, 0), // May 15, 2025, 10:00 AM
        status: MeetingStatus.PENDING,
        meetingNotes: []
    },
    {
        clientName: "David Chen",
        clientEmail: "david.chen@techcorp.co",
        projectName: "API Integration Service",
        projectBudget: "$2,500-$4,000",
        projectDescription: "We need help integrating our existing CRM system with a new payment processing API. The integration should synchronize customer data, handle webhook events, and provide detailed logging for troubleshooting.",
        scheduleMeetingDate: new Date(2025, 3, 28, 13, 15), // April 28, 2025, 1:15 PM (past meeting)
        status: MeetingStatus.COMPLETED,
        meetingNotes: [
            {
                note: "Meeting went well. Client already has documentation for both APIs. Need to discuss security considerations in the follow-up.",
            },
            {
                note: "Suggested webhooks for real-time syncing rather than scheduled jobs. Client liked the approach.",
            }
        ]
    },
    {
        clientName: "Jessica Williams",
        clientEmail: "j.williams@design.studio",
        projectName: "Portfolio Website",
        projectBudget: "$1,500-$2,500",
        projectDescription: "I'm a graphic designer looking to create a professional portfolio website to showcase my work. I need a clean, minimalist design with a gallery, about page, contact form, and blog section.",
        scheduleMeetingDate: new Date(2025, 5, 2, 16, 0), // June 2, 2025, 4:00 PM (future meeting)
        status: MeetingStatus.CONFIRMED,
        meetingNotes: []
    },
    {
        clientName: "Michael Brown",
        clientEmail: "michael@startupfounders.net",
        projectName: "SaaS Dashboard Prototype",
        projectBudget: "$6,000-$9,000",
        projectDescription: "We're developing a SaaS product for project management and need a working prototype of the main dashboard interface. The prototype should demonstrate the core functionality and user flow for managing projects, tasks, and team members.",
        scheduleMeetingDate: new Date(2025, 3, 20, 11, 30), // April 20, 2025, 11:30 AM (past meeting)
        status: MeetingStatus.CANCELLED,
        meetingNotes: [
            {
                note: "Client canceled the meeting due to internal restructuring. May reschedule in Q3.",
            }
        ]
    }
];