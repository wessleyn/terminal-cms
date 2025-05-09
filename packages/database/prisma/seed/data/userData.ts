import { UserRole } from "../../../generated/prisma";

export const userData =  [
    {
        id: '1',
        image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
        name: 'Robert Wolfkisser',
        role: UserRole.ADMIN,
        email: 'rob_wolf@gmail.com',
    },
    {
        id: '2',
        image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
        name: 'Jill Jailbreaker',
        email: 'jj@breaker.com',
    },
    {
        id: '3',
        image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
        name: 'Henry Silkeater',
        email: 'henry@silkeater.io',
    },
    {
        id: '4',
        image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
        name: 'Bill Horsefighter',
        email: 'bhorsefighter@gmail.com',
    },
    {
        id: '5',
        image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-10.png',
        name: 'Jeremy Footviewer',
        email: 'jeremy@foot.dev',
    },
];