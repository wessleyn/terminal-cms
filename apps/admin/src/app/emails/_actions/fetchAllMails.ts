import { EmailStatus, EmailType, prisma } from "@repo/db";

export default async function fetchAllMails(): Promise<FetchedMail[]> {
    const query = await prisma.email.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        where: {
            receivedAt: {
                not: null
            }
        },
        include: {
            from: true,
            to: true,
            attachments: true,
            _count: true
        }
    });

    return query;
}

export interface FetchedMail {
    to: {
        id: string;
        name: string | null;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    from: {
        id: string;
        name: string | null;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    };
    attachments: {
        size: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        emailId: string;
        filename: string;
        url: string;
        mimeType: string;
    }[];
    _count: {
        to: number;
        from: number;
        attachments: number;
    };
    body: string;
    id: string;
    fromId: string;
    subject: string;
    isArchived: boolean;
    isRead: boolean;
    isStarred: boolean;
    isSpam: boolean;
    isTrash: boolean;
    status: EmailStatus;
    type: EmailType;
    sentAt: Date | null;
    receivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}