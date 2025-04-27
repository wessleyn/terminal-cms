# Boot Terminal Portfolio Project Structure

This file provides context about the project structure for AI assistants like GitHub Copilot.

## Project Overview

A terminal-themed portfolio website built with Next.js, TypeScript, and Prisma, organized in a Turborepo monorepo structure.

## Project Apps Structure

The project consists of 4 main applications:

1. **Web** - Public-facing website containing both portfolio and blog (wesslyn.me and wesslyn.me/blog)
2. **Admin** - Admin dashboard for managing portfolio content and blog posts
3. **Docs** - Documentation site for the project
4. **Email Worker** - Cloudflare worker handling email subscriptions and notifications

## Monorepo Structure

```
terminal-portfolio/
├── apps/
│   ├── admin/     # Admin dashboard for content management
│   ├── web/       # Main public-facing website (portfolio + blog)
├── packages/
│   ├── database/  # Shared database access layer with Prisma
│   ├── eslint-config/ # Shared ESLint configurations
│   ├── typescript-config/ # Shared TypeScript configurations
│   ├── ui/        # Shared UI components with Mantine
├── workers/
│   ├── emailWorker/ # Cloudflare worker for handling emails
```

## Directory Structure

```
src
├── app
│   ├── (auth)
│   │   ├── _actions
│   │   │   ├── getCurrentUser.ts
│   │   │   ├── makeAuthSignIn.ts
│   │   │   ├── makeAuthSignup.ts
│   │   │   ├── makeEmailSignIn.ts
│   │   │   ├── makeEmailSignup.ts
│   │   │   └── makeSignout.ts
│   │   ├── _components
│   │   ├── _hooks
│   │   └── _utils
│   ├── (blog)
│   │   ├── _actions
│   │   │   ├── addToNewsLetter.ts
│   │   │   ├── fetchAllPosts.ts
│   │   │   ├── fetchFooterPosts.ts
│   │   │   ├── fetchPopularPosts.ts
│   │   │   └── fetchRecentPosts.ts
│   │   ├── _components
│   │   ├── _hooks
│   │   ├── [..id]
│   │   │   ├── _actions
│   │   │   │   ├── addToNewsLetter.ts
│   │   │   │   ├── fetchOnePost.ts
│   │   │   │   ├── fetchPostComments.ts
│   │   │   │   ├── fetchRelatedPosts.ts
│   │   │   │   ├── makeComment.ts
│   │   │   │   └── searchPost.ts
│   │   │   ├── _components
│   │   │   ├── _hooks
│   │   │   └── _utils
│   │   └── _utils
│   ├── (dashboard)
│   │   ├── _actions
│   │   ├── _components
│   │   ├── _hooks
│   │   └── _utils
│   ├── globals.css
│   ├── layout.tsx
│   └── (portfolio)
│       ├── _actions
│       │   ├── fetchAwesomePost.ts
│       │   └── fetchAwesomeProj.ts
│       ├── _components
│       │   └── Footer.tsx
│       ├── hireMe
│       │   ├── _actions
│       │   │   └── hireMe.ts
│       │   ├── _components
│       │   │   ├── SentMessage.tsx
│       │   │   └── SubmitButton.tsx
│       │   └── page.tsx
│       ├── layout.tsx
│       ├── page.tsx
│       ├── privacy
│       │   ├── fetchPrivacy.ts
│       │   └── page.tsx
│       ├── projects
│       │   ├── _actions
│       │   │   ├── fetchAllProj.ts
│       │   │   └── searchProj.ts
│       │   ├── _components
│       │   │   ├── ProjectGalleryCard.tsx
│       │   │   ├── ProjectGallery.tsx
│       │   │   ├── ProjectHero.tsx
│       │   │   └── ProjectNavigation.tsx
│       │   ├── _hooks
│       │   ├── [id]
│       │   │   ├── _actions
│       │   │   │   └── fetchProject.ts
│       │   │   ├── _components
│       │   │   │   └── ProjectDetail.tsx
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   └── _utils
│       │   │       └── projectNavigation.ts
│       │   ├── page.tsx
│       │   ├── _styles
│       │   │   └── projectGallery.css
│       │   └── _utils
│       └── _styles
│           └── styles.css
├── _components
│   ├── BaguetteBox.tsx
│   ├── BlogPagination.tsx
│   ├── ChartWrapper.tsx
│   ├── ThemeToggle.module.css
│   ├── ThemeToggleScript.tsx
│   ├── ThemeToggle.tsx
│   └── TypingEffect.tsx
├── _hooks
├── _libs
├── _styles
│   ├── baguetteBox.min.css
│   ├── bootstrap.min.css
│   ├── bs-theme-overrides.css
│   └── terminal-theme.css
├── types
│   └── baguettebox.d.ts
└── _utils
    └── prisma.ts
```

## Important Patterns to Follow

1. Components specific to a feature are placed in the `_components` folder within that feature's directory.
2. All database access functions are in `_actions` folders.
3. Utility functions are placed in `_utils` folders.
4. Styles specific to a feature are placed in `_styles` folders.
5. Components that are shared across features are placed in the root `_components` folder.
6. ProjectDetail component is located within projects/[id]/\_components/ folder.
7. The terminal theme is consistently applied throughout the application.
8. Shared UI components are in the packages/ui directory and imported into apps.
9. Database operations are centralized in the packages/database directory.

## Application Specific Notes

### Web App (wesslyn.me)

- Contains both portfolio and blog sections
- Portfolio accessible at the root path "/"
- Blog accessible at the "/blog" path
- Uses shared UI components from the packages/ui library

### Admin App

- Protected dashboard requiring authentication
- Used for managing portfolio projects and blog content
- Contains interfaces for content editing, publishing, and analytics

### Docs App

- Documentation for the project
- Information about the tech stack, architecture, and usage

### Email Worker

- Cloudflare worker for handling email subscriptions
- Processes newsletter signups and notifications

## Database Schema

The project uses Prisma with the following schemas:

- emails.prisma - Email subscription model
- posts.prisma - Blog post models
- projects.prisma - Project portfolio models
- users.prisma - User authentication models
- schema.prisma - Main schema file

## Notes for Code Generation

- When generating components, respect the existing directory structure
- Keep components in their appropriate feature folders
- Follow the terminal-themed styling for UI components
- Server actions should be placed in \_actions folders
- Maintain the proper import paths based on the directory structure

## Themes and Styles

If a comp is a button or a similar comp with text paddled inside , inside another color, the text might be on a custom color other than the bg-color (i.e black) then color the body (i.e btn bg ) withe a greenshade 9 or better (8-9) to match the dark bg

And if its directly unto the bg , use a ligh shade of 3-5 (or better)
