# GNCO Platform

GNCO Platform is a production-ready Next.js 14 application for institutional fund structuring, operations, and intelligence workflows. Learn more at [gnco.io](https://gnco.io).

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Clerk (authentication)
- Prisma + PostgreSQL
- Radix UI primitives
- Recharts, Framer Motion, Lucide
- Zod + React Hook Form
- Vercel deployment

## Local Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd gnco-platform
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template:
   ```bash
   cp .env.local.example .env.local
   ```
4. Run the app:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## Environment Variables

| Variable | Description | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable frontend key | Clerk Dashboard |
| `CLERK_SECRET_KEY` | Clerk backend secret key | Clerk Dashboard |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route path | App routing config |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route path | App routing config |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Post sign-in redirect | Product requirements |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Post sign-up redirect | Product requirements |
| `DATABASE_URL` | PostgreSQL connection string | Supabase/Neon project settings |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 | AWS IAM |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 | AWS IAM |
| `AWS_REGION` | S3 region | AWS console |
| `AWS_S3_BUCKET` | Document storage bucket | AWS S3 |
| `RESEND_API_KEY` | API key for email notifications | Resend Dashboard |
| `NOTIFICATION_EMAIL` | Destination inbox for notifications | Internal ops setting |
| `NEXT_PUBLIC_APP_URL` | Public base URL of GNCO app | Deployment environment |
| `NEXT_PUBLIC_APP_ENV` | Runtime environment label | Deployment environment |

## Deployment (Vercel)

1. Push your branch to GitHub.
2. Import the project in Vercel.
3. Configure all variables from `.env.local.example`.
4. Confirm `vercel.json` build settings.
5. Deploy to production; default region is `iad1`.

## Design System

### Color Tokens

| Token | Hex |
| --- | --- |
| `bg-primary` | `#080C14` |
| `bg-surface` | `#0D1520` |
| `bg-elevated` | `#131D2E` |
| `bg-border` | `#1E2D42` |
| `accent-gold` | `#C9A84C` |
| `accent-gold-light` | `#E8C97A` |
| `accent-blue` | `#3B82F6` |
| `accent-green` | `#10B981` |
| `accent-red` | `#EF4444` |
| `accent-amber` | `#F59E0B` |
| `text-primary` | `#F0F4FF` |
| `text-secondary` | `#8FA3BF` |
| `text-tertiary` | `#4A6080` |

### Typography Scale

- Display: `DM Serif Display`, 48/56, 600
- Heading: `DM Sans`, 32/40, 600
- Subheading: `DM Sans`, 24/32, 500
- Body: `DM Sans`, 16/24, 400
- Caption: `DM Sans`, 14/20, 400

## Module Overview

- **Architect**: intake workflow, jurisdiction recommendations, and pre-legal structuring briefs.
- **Operator**: LP registry, capital calls, distributions, and institutional document vault workflows.
- **Intelligence**: performance dashboards, fund analytics, and reporting automation.

## Contributing

- Create feature branches with `feature/xxx`.
- Create bugfix branches with `fix/xxx`.
- Ensure linting and schema validation pass before opening PRs.
- Open a PR with concise summary, testing evidence, and rollout notes.
