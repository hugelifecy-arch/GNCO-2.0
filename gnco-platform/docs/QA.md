# Manual QA Checklist

## Core navigation
- [ ] Header CTA (`Start Free →`) opens `/architect` and does not 404.
- [ ] Footer legal links (`/privacy-policy`, `/terms-of-service`, `/disclosures`) all resolve.

## Demo experience
- [ ] Demo badge is visible on landing navigation.
- [ ] Demo toggle (where present) switches data state correctly.

## Coverage and architect
- [ ] Coverage detail pages resolve for each jurisdiction slug from `/coverage`.
- [ ] Architect results page (`/architect/results`) is reachable and displays:
  - [ ] 3 ranked structures
  - [ ] explainability section
  - [ ] red flag section

## Monetization scaffold
- [ ] Export PDF button on `/architect/results` downloads a PDF.
- [ ] PDF contains disclaimer text, sources, and date.
- [ ] Marketplace form on `/marketplace` submits and shows confirmation.
- [ ] `/intelligence/radar` clearly displays sample/demo synthetic alerts and disclaimer.
- [ ] `/reports` exports `Export ILPA CSV (Beta)` with the documented headers.
