# Terminal Portfolio + Blog + Dashboard

A terminal-themed portfolio website built with Next.js, TypeScript, and Prisma.

## Project Structure

The project follows a feature-based organization pattern:

```
src/
├── app/
│   ├── (auth)/            # Authentication related routes and functionality
│   ├── (blog)/            # Blog related routes and functionality
│   ├── (dashboard)/       # Dashboard related routes and functionality
│   └── (portfolio)/       # Portfolio related routes and functionality
│       ├── projects/      # Projects showcase and gallery
│       │   ├── _actions/  # Server actions for projects
│       │   ├── _components/  # Project-specific components
│       │   ├── [id]/      # Individual project detail pages
│       │   └── page.tsx   # Projects gallery page
│       └── ...
├── _components/           # Shared components across features
├── _hooks/                # Custom React hooks
├── _styles/               # Global stylesheets
└── _utils/                # Utility functions
```

### Directory Structure Conventions

1. `_actions/` - Server actions for data fetching and mutations
2. `_components/` - UI components specific to a feature
3. `_hooks/` - Custom React hooks specific to a feature
4. `_utils/` - Utility functions specific to a feature
5. `_styles/` - CSS files specific to a feature

Components specific to a feature should be placed in the `_components` folder within that feature's directory. Shared components go in the root `_components` folder.

## Database Schema

The application uses Prisma with a PostgreSQL database with the following schemas:

- `projects.prisma` - Project portfolio data
- `posts.prisma` - Blog posts and comments
- `emails.prisma` - Email subscription data
- `users.prisma` - User authentication data

## Development Guidelines

### Component Placement

- Components specific to a feature should be placed in the `_components` directory of that feature
- Components that are shared across multiple features should be placed in the root `_components` directory

### Data Fetching

- All data fetching should be done using server actions in the `_actions` directories
- Use the Prisma client from `@/_utils/prisma` to interact with the database

### Styling

- The application uses a terminal-themed style with dark mode aesthetics
- Global styles are in `_styles/terminal-theme.css`
- Feature-specific styles are in the `_styles` directory within that feature's directory

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the database connection in `.env` file
4. Run database migrations: `npx prisma migrate dev`
5. Seed the database: `npx prisma db seed`
6. Start the development server: `npm run dev`

## License

[MIT License](LICENSE)
