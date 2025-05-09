# Terminal Portfolio + Blog + CMS

A monorepo project containing a terminal-themed portfolio website with integrated blog and content management system.

## Tech Stack

### Frontend

- Next.js
- Bootstrap 5
- Mantine UI
- Zustand

### Backend

- Next.js (API Routes)
- Prisma (ORM)
- Prisma Accelerate (Storage)
- Cloudinary (Image Hosting)
- Auth.js (Authentication)
- Cloudflare Workers (Email Routing to Custom Inbox)

Inbound emails to the domain are caught midway and saved to a database using Prisma ORM.

### Hosting

- Vercel/Cloudflare

## Project Structure

This is a monorepo built with Turborepo containing multiple applications:

- **Web App (`/apps/web`)**: Public-facing website containing both portfolio and blog
- **Admin App (`/apps/admin`)**: Admin dashboard for managing portfolio content and blog posts
- **Packages**:
  - `@repo/auth`: Authentication utilities with Auth.js
  - `@repo/db`: Database access layer with Prisma
  - `@repo/ui`: Shared UI components
  - `@repo/eslint-config`: Shared ESLint configurations
  - `@repo/typescript-config`: Shared TypeScript configurations
- **Workers**:
  - `emailWorker`: Cloudflare worker for handling email subscriptions and notifications

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm (v11.3.0 or later)
- PostgreSQL

### Initial Setup

1. Clone the repository:

   ```
   git clone https://github.com/wessleyn/terminal-portfolio.git
   cd terminal-portfolio
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   Create `.env` files in both the `apps/web`, `apps/admin`, and `packages/database` directories using the example files provided:

   ```bash
   # Copy example files for development
   cp apps/web/.env.example apps/web/.env
   cp apps/admin/.env.example apps/admin/.env
   cp packages/database/.env.example packages/database/.env
   ```

   Then edit each `.env` file to add your specific configuration values. For production environments, use the `.env.production.example` files as templates instead.

   Key environment variables you'll need to configure:

   - **Database**: Set up your local PostgreSQL URL or Prisma Accelerate connection
   - **Authentication**: Create a secure random secret for AUTH_SECRET
   - **OAuth**: If using social login, add your GitHub/Google credentials
   - **API Keys**: Add API keys for services like Resend, Cloudinary, etc.

   Refer to the Environment Variables section below for more details.

4. Generate Prisma client:

   ```
   npm run db:generate
   ```

5. Run database migrations:
   ```
   npm run db:migrate
   ```

### Development Environment

Run the development server for all applications:

```
npm run dev
```

To run only specific apps:

```
npm run dev:web     # Run only web app
npm run dev:admin   # Run only admin app
```

For local HTTPS development (with self-signed certificates):

```
npm run devStart    # Uses Next.js experimental HTTPS
```

### Production Environment

Build all applications:

```
npm run build
```

Start all applications in production mode:

```
npm run start:web     # Start web app in production mode
npm run start:admin   # Start admin app in production mode
```

## Environment Variables

### Web App (apps/web/.env)

```
# App URLs
WEB_PUBLIC_URL=https://yourdomain.com
ADMIN_PUBLIC_URL=https://admin.yourdomain.com

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/terminal_portfolio

# Authentication
AUTH_SECRET=your_auth_secret_key
AUTH_TRUST_HOST=true
PUBLIC_DOMAIN=yourdomain.com

# OAuth Providers
AUTH_GITHUB_ID=your_github_oauth_id
AUTH_GITHUB_SECRET=your_github_oauth_secret
AUTH_GOOGLE_ID=your_google_oauth_id
AUTH_GOOGLE_SECRET=your_google_oauth_secret

# Email Service
RESEND_API_KEY=your_resend_api_key
RESEND_MAILING_ADDRESS=noreply@yourdomain.com
```

### Admin App (apps/admin/.env)

```
# App URLs
WEB_PUBLIC_URL=https://yourdomain.com
ADMIN_PUBLIC_URL=https://admin.yourdomain.com

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/terminal_portfolio

# Authentication
AUTH_SECRET=your_auth_secret_key
AUTH_TRUST_HOST=true
PUBLIC_DOMAIN=yourdomain.com
```

## Deployment Notes

### Vercel Domain Configuration

When setting up the application on Vercel, make sure to use the `www.` prefix for your domain (e.g., `www.yourdomain.com` instead of just `yourdomain.com`). This ensures that authentication works properly across redirects and sessions.

If using a root domain without `www.` prefix, you may encounter authentication issues with session cookies not being properly set or recognized, particularly with OAuth providers.

### Prisma in Production

For production builds, the project is configured to use Prisma's `--no-engine` flag to optimize bundle size and improve deployment performance. This is handled automatically via the `db:generate:prod` script.

## Commands Reference

```
# Development
npm run dev            # Start all apps in dev mode
npm run dev:web        # Start web app in dev mode
npm run dev:admin      # Start admin app in dev mode
npm run devStart       # Start with HTTPS for local dev

# Production
npm run build          # Build all apps
npm run start:web      # Start web app in production
npm run start:admin    # Start admin app in production

# Database
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations
npm run db:deploy      # Deploy database changes to production

# Quality
npm run lint           # Run linting
npm run check-types    # Run type checking
npm run format         # Format code with prettier
```

## Script Naming Conventions

We've decisively adopted the `<action>:<scope>` pattern for our scripts (using `dev:admin` instead of `admin:dev`). This isn't just preference - it's a strategic choice that gives us concrete advantages:

### Why We Commit to `<action>:<scope>`

- **Command Control**: We group by action first because it's what you're trying to do. Need all dev environments? Just `npm run dev:*` and you're set.
- **Instant Recognition**: When scanning our `package.json`, you immediately know what each script does before seeing where it applies.
- **Team Alignment**: Following established npm patterns means new developers join with zero friction - they already understand our naming structure.

Our actual implementation proves this works:

```
dev:admin    # One command - admin env running
dev:web      # One command - web app running
dev:email    # One command - email service running
```

This approach isn't theoretical - it's battle-tested across our workflow. The colon isn't just syntax; it's our organizing principle that keeps commands predictable and efficient as the project scales.

## Certificate Setup for Local HTTPS Development

The project includes self-signed certificates for local HTTPS development. If you need to generate new ones:

```
npx mkcert create-ca
npx mkcert create-cert --domains localhost
```

Move the generated certificates to:

- `apps/web/certificates/`
- `apps/admin/certificates/`

## License

[MIT License](LICENSE)
