# FaxBella — Premium Full Application Build

## Context

FaxBella is an AI-powered fax routing SaaS with a production-ready Convex backend but only a bare-bones landing page for frontend. The goal is to build a premium, non-traditional design with the complete application. **Frontend first** — no backend changes until the design is locked in.

## Immediate Goal: Three Design Variations on Localhost

Build 3 distinct visual directions as real Next.js pages. User reviews all three in-browser, picks one (or a hybrid), then we build the full app on that foundation.

---

## Step 1: Install Dependencies + Configure Tailwind

| Action | Detail |
|--------|--------|
| Install | `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `lucide-react`, `clsx` |
| Create | `postcss.config.mjs` with Tailwind 4 plugin |
| Rewrite | `app/globals.css` with `@import "tailwindcss"` + design tokens for all 3 variations |
| Keep | Next.js dev server running on port 3333 |

## Step 2: Build Three Variation Pages (Frontend Only)

### Variation A: "Fluid & Luminous" — `/variation-a`

| Element | Approach |
|---------|----------|
| Shapes | Soft curves, 24-32px radius, no sharp corners |
| Layout | Asymmetric hero, overlapping sections, floating cards |
| Background | Warm mesh gradients, soft light blobs, layered depth |
| Cards | Frosted glass (backdrop-blur), floating with generous shadow |
| Colors | Warm teal (#0d9488) + golden amber (#d97706) + cream (#fefdfb) |
| Typography | DM Sans headings (light weight), Inter body |
| Dashboard mock | Bento-grid layout, mixed-size cards |
| Feel | Premium health-tech, warm and organic |

### Variation B: "Bold & Editorial" — `/variation-b`

| Element | Approach |
|---------|----------|
| Shapes | Mix rounded + clean edges, bold section breaks |
| Layout | Large hero typography, editorial whitespace, full-bleed color sections |
| Background | Solid warm color blocks, clean and confident |
| Cards | Flat with strong accent borders (left or top), minimal shadow |
| Colors | Deep sage (#4a7c6f) + warm coral (#e07a5f) + warm white (#faf7f2) |
| Typography | Outfit headings (medium weight), Inter body, oversized hero text |
| Dashboard mock | Card-based with strong visual hierarchy |
| Feel | Premium editorial publication, bold and clean |

### Variation C: "Lyniq-Inspired" — `/variation-c`

Adapted from https://lyniq.framer.website/ but made warm + light mode per Nolen rules.

| Element | Approach |
|---------|----------|
| Shapes | Geometric precision, circular CTAs, accent lines/borders |
| Layout | High contrast sections, generous whitespace, modular grid |
| Background | Warm whites with strategic dark accent sections (inverted hero) |
| Cards | Clean with subtle borders, consistent padding, refined shadows |
| Colors | Warm charcoal (#2c2c2c) + vibrant coral-red (#e8553d) + warm ivory (#faf8f5) |
| Typography | Display font for hero (bold, oversized), monospace accents, Inter body |
| Dashboard mock | Grid-based with geometric precision, accent color pops |
| Unique | Circular CTA buttons, blend-mode effects, gradient masks, accent borders |
| Feel | Modern studio, sophisticated and contemporary |

### What each variation page includes:
- Marketing header (logo + nav)
- Hero section
- Features section
- How-it-works section
- Pricing preview (3 tiers)
- Dashboard mockup (static)
- Footer
- Fully responsive

### Files to create:
- `postcss.config.mjs`
- `lib/constants.ts` — plan data, features, site config
- `lib/utils.ts` — cn() helper
- `components/ui/button.tsx` — base button
- `components/ui/card.tsx` — base card
- `app/globals.css` — Tailwind + tokens
- `app/variation-a/page.tsx`
- `app/variation-b/page.tsx`
- `app/variation-c/page.tsx`
- `app/page.tsx` — update to link to all 3 variations

## Step 3: Review on Localhost

| URL | What |
|-----|------|
| `http://localhost:3333/variation-a` | Fluid & Luminous |
| `http://localhost:3333/variation-b` | Bold & Editorial |
| `http://localhost:3333/variation-c` | Lyniq-Inspired |

User picks one or a hybrid. Unchosen variations get deleted.

---

## After Design is Chosen: Full Application Build (Frontend First)

### Phase 1: Component Library
Build all shared UI components with chosen design tokens.

### Phase 2: Auth Pages
Signup + Login pages with passkey UI (frontend only, connect to backend later).

### Phase 3: Marketing Site + App Shell
Landing page (final version), pricing, contact, dashboard layout with sidebar.

### Phase 4: Feature Pages
Recipients, inbox, fax detail, send fax, sent faxes, settings — all frontend.

### Phase 5: Polar Payments
Install Polar SDK, checkout route, webhook handler, billing page.

### Phase 6: AI Concierge
Chat UI component, dashboard insights panel.

### Phase 7: Polish & Deploy
Responsive audit, accessibility, error pages, Cloudflare deploy.

---

## Verification

| Check | How |
|-------|-----|
| All 3 variations render | Visit each URL on localhost:3333 |
| Responsive | Resize browser to 375px, 768px, 1440px |
| No boxy/traditional feel | Visual review — soft curves, editorial, or modern studio |
| Light mode default | All variations are warm light mode |
| No emoji icons | Only lucide-react functional icons |
| Tailwind working | Inspect elements, verify utility classes |
