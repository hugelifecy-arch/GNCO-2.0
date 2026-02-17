# GNCO — Global Fund Architect

GNCO is a professional web application for institutional investors (Family Offices, GPs, and LPs) managing $100M to $10B+ in assets.

## Product Modules

1. **Architect**: An 8-step guided wizard to model and recommend fund structures across global jurisdictions.
2. **Operator**: Day-to-day fund operations (LP registry, capital calls, distributions, document vault, ILPA reporting).
3. **Intelligence (Scaffold)**: Future AI assistant, regulatory monitoring, and scenario stress testing.

## Core Audience

- Family Office CIOs and CFOs
- GP fund managers
- LP investors tracking capital
- Fund administrators and legal counsel

## Design Mandate

- Institutional dark theme with luxury refinement
- Typography:
  - Headings: **DM Serif Display**
  - Body: **DM Sans**
- Avoid generic consumer UI patterns and non-institutional visual language

## Non-Negotiable Rules

1. Do not use the word **"Prototype"** in headlines or hero sections.
2. Legal disclaimer must live only in the fixed footer bar.
3. "Request Access" CTA must appear in navbar, hero, and bottom CTA section.
4. Use CSS custom property tokens for all colors.
5. Ensure responsive behavior at 375px / 768px / 1440px.
6. Provide hover and focus states for every interactive element.
7. Log all audit trail actions with timestamp and user.

## Locked Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript strict mode
- **Styling**: Tailwind CSS + CSS custom properties
- **Components**: shadcn/ui (GNCO customized)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Auth**: Clerk (mock/stub until real integration)
- **Database**: Prisma + PostgreSQL (schema defined, no live DB yet)
- **Hosting**: Vercel (`vercel.json` required)
