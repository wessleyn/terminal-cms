import { ActivityStatus, HappyIndex, PublishStatus } from "../../../generated/prisma";

export const projectsData = [
    {
        title: 'Portfolio Website',
        description: 'A responsive portfolio website built with Next.js, TypeScript, and Prisma. Features a terminal-like interface and showcases my projects and skills.',
        imageUrl: '/projects/portfolio.png',
        githubUrl: 'https://github.com/username/portfolio',
        liveUrl: 'https://portfolio.example.com',
        tags: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS'],
        featured: true,
        publishStatus: PublishStatus.PUBLISHED,
        activityStatus: ActivityStatus.COMPLETED,
        engagement: {
            share: 65,
            bookmark: 20,
            like: 15
        }
    },
    {
        title: 'Butler App',
        description: 'A digital butler application that helps users organize their daily tasks, manage schedules, and send reminders. Built with React Native and Firebase.',
        imageUrl: '/projects/butler.png',
        githubUrl: 'https://github.com/username/butler-app',
        liveUrl: 'https://butler-app.example.com',
        tags: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
        featured: true,
        publishStatus: PublishStatus.PUBLISHED,
        activityStatus: ActivityStatus.IN_PROGRESS,
        happyIndex: HappyIndex.AWESOME,
        engagement: {
            share: 45,
            bookmark: 35,
            like: 20
        }
    },
    {
        title: 'Customer Portal',
        description: 'A comprehensive customer portal for a SaaS product. Features include user authentication, dashboard analytics, and subscription management.',
        imageUrl: '/projects/portal.png',
        githubUrl: 'https://github.com/username/customer-portal',
        liveUrl: 'https://portal.example.com',
        tags: ['React', 'Node.js', 'Express', 'MongoDB'],
        featured: true,
        publishStatus: PublishStatus.PUBLISHED,
        activityStatus: ActivityStatus.COMPLETED,
        happyIndex: HappyIndex.AWESOME,
        engagement: {
            share: 50,
            bookmark: 30,
            like: 20
        }
    },
    {
        title: 'E-commerce Platform',
        description: 'A full-featured e-commerce platform with product listings, shopping cart, payment processing, and order management.',
        imageUrl: '/assets/img/projects/project1.webp',
        githubUrl: 'https://github.com/username/ecommerce',
        liveUrl: 'https://shop.example.com',
        tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
        featured: false,
        publishStatus: PublishStatus.DRAFT,
        activityStatus: ActivityStatus.IN_PROGRESS,
        engagement: {
            share: 25,
            bookmark: 45,
            like: 30
        }
    },
    {
        title: 'Weather Dashboard',
        description: 'A weather dashboard application that displays current weather conditions and forecasts for multiple locations.',
        imageUrl: '/assets/img/projects/project2.webp',
        githubUrl: 'https://github.com/username/weather-app',
        liveUrl: 'https://weather.example.com',
        tags: ['React', 'Weather API', 'ChartJS', 'Styled Components'],
        featured: false,
        publishStatus: PublishStatus.ARCHIVED,
        activityStatus: ActivityStatus.NOT_STARTED,
        engagement: {
            share: 40,
            bookmark: 20,
            like: 40
        }
    },
    {
        title: 'Task Management System',
        description: 'A Kanban-style task management application with drag-and-drop functionality, task assignments, and progress tracking.',
        imageUrl: '/assets/img/projects/project3.webp',
        githubUrl: 'https://github.com/username/task-manager',
        liveUrl: 'https://tasks.example.com',
        tags: ['Vue.js', 'Vuex', 'Node.js', 'MongoDB'],
        featured: false,
        publishStatus: PublishStatus.DRAFT,
        activityStatus: ActivityStatus.NOT_STARTED,
        engagement: {
            share: 20,
            bookmark: 50,
            like: 30
        }
    },
    {
        title: 'Social Media Dashboard',
        description: 'A dashboard that aggregates and analyzes social media data from multiple platforms.',
        imageUrl: '/assets/img/projects/project4.webp',
        githubUrl: 'https://github.com/username/social-dashboard',
        liveUrl: 'https://social.example.com',
        tags: ['React', 'GraphQL', 'Social Media APIs', 'D3.js'],
        featured: false,
        publishStatus: PublishStatus.ARCHIVED,
        activityStatus: ActivityStatus.IN_PROGRESS,
        engagement: {
            share: 55,
            bookmark: 15,
            like: 30
        }
    },
    {
        title: 'Recipe Finder',
        description: 'An application that helps users find recipes based on available ingredients, dietary restrictions, and cuisine preferences.',
        imageUrl: '/assets/img/projects/project5.webp',
        githubUrl: 'https://github.com/username/recipe-finder',
        liveUrl: 'https://recipes.example.com',
        tags: ['Angular', 'TypeScript', 'Firebase', 'Material UI'],
        featured: false,
        publishStatus: PublishStatus.PUBLISHED,
        activityStatus: ActivityStatus.COMPLETED,
        engagement: {
            share: 35,
            bookmark: 40,
            like: 25
        }
    },
    {
        title: 'Budget Tracker',
        description: 'A personal finance application for tracking expenses, creating budgets, and visualizing spending habits.',
        imageUrl: '/assets/img/projects/project6.webp',
        githubUrl: 'https://github.com/username/budget-tracker',
        liveUrl: 'https://budget.example.com',
        tags: ['React', 'Redux', 'Express', 'MongoDB'],
        featured: false,
        publishStatus: PublishStatus.PUBLISHED,
        activityStatus: ActivityStatus.COMPLETED,
        engagement: {
            share: 30,
            bookmark: 25,
            like: 45
        }
    }
];