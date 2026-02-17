# Phase 0 Context Brief

This file captures the baseline product intent and implementation constraints for all future GNCO build sessions.

## Product Definition

GNCO (Global Fund Architect) is a professional platform for institutional fund structuring and operations.

### Primary Users

- Family Office CIO/CFO teams
- GP fund managers
- LP investors
- Fund administrators and legal counsel

### Module Plan

1. **Architect**
   - 8-step guided wizard
   - Inputs: strategy, LP mix, GP domicile, priorities
   - Outputs: scored recommendation over 14 jurisdictions, LP tax impact modeling, pre-legal brief
2. **Operator**
   - LP registry
   - Capital call manager
   - Distribution waterfall calculator
   - Document vault
   - ILPA-standard reporting
3. **Intelligence**
   - AI query assistant (future)
   - Regulatory monitoring (future)
   - Scenario stress testing (future scaffold)

## UX and Visual Direction

- Luxury-refined institutional dark theme
- Brand feel: Bloomberg Terminal × Swiss private bank × Figma precision
- Typography standards:
  - Headings: DM Serif Display
  - Body: DM Sans
- Explicitly avoid: Inter, Roboto, Arial, purple gradients, generic AI aesthetic patterns

## Engineering Constraints

- Next.js 14+ App Router
- TypeScript strict mode
- Tailwind CSS + CSS custom properties
- shadcn/ui component system (GNCO customized)
- Lucide React for icons
- Recharts for data visualization
- Framer Motion for animation
- Clerk auth (stubbed)
- Prisma + PostgreSQL schema-first workflow
- Deploy target: Vercel

## Compliance Checklist

- [ ] No "Prototype" in hero/headline
- [ ] Legal disclaimer appears only in fixed footer
- [ ] "Request Access" appears in navbar, hero, and bottom CTA
- [ ] Color usage only through CSS custom property tokens
- [ ] Responsive breakpoints validated at 375 / 768 / 1440
- [ ] Hover + focus states implemented for all interactive controls
- [ ] Audit trail records timestamp + user for every action
