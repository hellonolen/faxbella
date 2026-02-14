# FaxBella Key Prompts, Audit Findings, and Context

## Overview

This document captures the key prompts, audit findings, and contextual information gathered during development sessions. It serves as a reference for understanding how the project evolved, what was discovered during audits, and what prompts or instructions drove key decisions.

---

## Audit Findings - Feb 7, 2026

### Full Codebase Audit

**Audit Scope**: Complete review of all source files, documentation, package.json, and project structure.

**Methodology**: Read all 15 existing docs (01-vision through 15-prod-readiness), all 6 Convex backend files, the Next.js frontend page, package.json, and configuration files. Cross-referenced documented plans against actual implementation.

### Finding 1: Backend AI Routing is Enterprise-Grade

**Rating**: Excellent

The core AI routing engine in `convex/faxRouting.ts` is the strongest part of the codebase. The Gemini 2.0 Flash prompt is 277 lines of carefully structured instructions that performs 6 distinct operations in a single API call:

1. **OCR Extraction** -- Full text extraction from fax PDFs
2. **Document Classification** -- Categorizes into 12 document types (referral, prescription_refill, lab_results, invoice, prior_auth, medical_records, insurance_claim, appointment_request, test_results, discharge_summary, consultation_notes, other)
3. **Urgency Detection** -- Three-level system (urgent/routine/low) with trigger word detection (STAT, ASAP, Emergency, Critical)
4. **Recipient Routing** -- Matches against registered recipients by name, email, company, and keywords
5. **Structured Data Extraction** -- 14+ fields including patient name, DOB, MRN, sender org, insurance provider, authorization number
6. **Multi-Patient Detection** -- Identifies faxes containing multiple patient records

The prompt enforces JSON output via Gemini's `responseMimeType: 'application/json'` with `temperature: 0.1` for deterministic results. This is a production-quality implementation.

**Competitor Research Incorporated**: The routing engine explicitly draws from 5 industry competitors:
- Concord Technologies -- Structured data extraction patterns
- eFax Clarity -- Intelligent routing by name/keyword/company
- ETHERFAX AI Insights -- Comprehensive data extraction fields
- Phelix AI -- Urgency detection, multi-patient splitting
- Medsender AI -- Document classification categories

### Finding 2: Database Schema is Comprehensive

**Rating**: Excellent

The `convex/schema.ts` defines 4 tables with proper Convex validators, optional fields for progressive data population, and 11 database indexes covering every query pattern used in the application:

- `customers` -- 3 indexes (by_email, by_stripeCustomer, by_webhookSecret)
- `recipients` -- 2 indexes (by_customer, by_customer_email)
- `inboundFaxes` -- 5 indexes (by_customer, by_customer_status, by_customer_urgency, by_customer_documentType, by_providerFaxId, by_parentFax)
- `outboundFaxes` -- 2 indexes (by_customer, by_customer_status)

Notable design decisions in the schema:
- Optional `geminiApiKey` per customer (bring-your-own-key model)
- Optional HumbleFax credentials per customer (platform fallback)
- `structuredData` as a deeply nested optional object with 14+ fields
- Multi-patient splitting via `parentFaxId`, `splitIndex`, `totalSplits` self-referencing pattern

### Finding 3: Webhook Architecture is Well-Designed

**Rating**: Excellent

The `convex/http.ts` webhook handler demonstrates good architecture:
- Fast response path: Store fax record, schedule async processing, return 200 in <200ms
- Per-customer routing via URL-embedded webhook secrets (`/webhook/{secret}`)
- Plan limit enforcement before processing (returns 429 if exceeded)
- Event type filtering (only processes `IncomingFax.SendComplete`)
- Comprehensive error handling with proper HTTP status codes (401, 400, 429, 500)

### Finding 4: No Authentication System Exists

**Rating**: Critical Gap

There is zero authentication code in the project:
- No login/signup pages
- No auth provider integration (Clerk, Auth0, NextAuth, custom)
- No session management
- No protected routes
- No middleware for auth checks

The `convex/customers.ts` mutations like `getDashboard` accept a raw email string parameter with no verification that the caller owns that email. This is acceptable for internal functions but means there is no access control.

**Impact**: Cannot launch without auth. Customers cannot create accounts, log in, or access dashboards.

### Finding 5: No Stripe Payment Flow Exists

**Rating**: Critical Gap

Stripe packages are installed (`stripe` and `@stripe/stripe-js` in package.json) but there is no implementation:
- No Stripe checkout session creation
- No Stripe webhook handler for subscription events
- No billing portal integration
- No plan upgrade/downgrade flow
- The `createCustomer` internal mutation expects `stripeCustomerId` but nothing generates it

**Impact**: Cannot launch without payments. No way to convert trial users to paid.

### Finding 6: Frontend is Minimal

**Rating**: Partial

Only one page exists (`app/page.tsx`) with a basic landing page structure. It has the right sections (hero, features, how-it-works, pricing, footer) but:
- Uses generic CSS class names with no actual stylesheet definitions for them
- No responsive design
- No images or visual design
- No navigation bar
- Links to `/signup` which does not exist
- No favicon or metadata beyond basic layout

The `app/globals.css` exists but was not reviewed for completeness. The `app/layout.tsx` likely provides basic Next.js structure.

### Finding 7: Documentation is Exceptional

**Rating**: Excellent

15 documentation files covering every aspect of the business and product:

| File | Topic | Quality |
|------|-------|---------|
| 01-vision.md | Mission, values, 3-year roadmap | Thorough |
| 02-problem.md | Market pain, cost analysis, competitor gaps | Data-driven |
| 03-customer.md | ICP, 3 personas with quotes, anti-personas | Detailed |
| 04-solution.md | 3-step UX, ROI calculator, competitive matrix | Compelling |
| 05-features.md | 14 features across 3 plan tiers, roadmap | Complete |
| 06-pricing.md | Tiers, ROI analysis, objection handling | Sales-ready |
| 07-ux.md | User flows, page designs, email templates, mobile UX | Comprehensive |
| 08-tech.md | Full architecture diagram, schema, API design | Technical |
| 09-security.md | HIPAA compliance, encryption, vendor security | Thorough |
| 10-legal.md | ToS, privacy, BAA, DPA, insurance coverage | Complete |
| 11-metrics.md | KPIs, dashboards, quarterly targets | Actionable |
| 12-launch.md | 3-phase plan, checklist, marketing channels | Operational |
| 13-sales.md | Funnel, objections, outbound playbook | Sales-ready |
| 14-ops.md | Support, billing, monitoring, vendor management | Operational |
| 15-prod-readiness.md | Checklist with honest status assessment | Accurate |

This documentation quality is rare for an early-stage project. It provides a complete blueprint for building and launching the product.

### Finding 8: Naming Inconsistency

**Rating**: Minor

The project has a naming inconsistency:
- Domain and branding: **FaxBella** (faxbella.com)
- Webhook secret prefix: `faxai_` (in `customers.ts` generateWebhookSecret function)
- Code comments: References to "FaxAI SaaS" in `customers.ts` and `recipients.ts`
- Schema comments: "FaxAI" in schema.ts

This suggests the project was originally named "FaxAI" and rebranded to "FaxBella". The code references should be updated for consistency.

---

## Key Prompts and Context

### Project Identity Prompt

FaxBella is an **independent business** operated by Doclish Inc. It is a standalone SaaS product, not a feature of another product. Key identity points:
- AI-powered fax routing for healthcare practices, vet clinics, law firms
- $2.5B cloud fax market with no AI routing leader
- Target: multi-provider practices receiving 25-500 faxes/day
- North star metric: faxes routed per month
- Domain: faxbella.com

### Technical Architecture Prompt

When building FaxBella features, adhere to:
- **Backend**: Convex serverless functions (mutations, queries, actions, internal variants)
- **AI**: Gemini 2.0 Flash via REST API with PDF inline_data
- **Email**: EmailIt ONLY (never Resend, SendGrid, or others)
- **Fax**: HumbleFax API for both inbound webhooks and outbound sending
- **Payments**: Stripe for subscriptions
- **Frontend**: Next.js 15 App Router with React 19
- **Hosting**: Cloudflare Pages (frontend) + Convex Cloud (backend)

### Email Policy Prompt

This is a hard constraint documented in README.md and enforced in code comments:

> Use EmailIt for ALL email delivery. Never use Resend, SendGrid, or any other email provider.

Every file that sends email (`faxRouting.ts`, `outboundFax.ts`) includes comments reinforcing this policy.

### Competitor Research Context

The AI routing prompt was built by studying 5 competitors and incorporating their best features:

| Competitor | What FaxBella Borrowed |
|-----------|----------------------|
| Concord Technologies | Structured data extraction fields (patient, sender, insurance) |
| eFax Clarity | Intelligent routing by name, keyword, company, specialty |
| ETHERFAX AI Insights | Comprehensive data extraction with custom fields support |
| Phelix AI | Urgency detection (STAT/ASAP/Emergency), multi-patient splitting |
| Medsender AI | Document classification into 12 healthcare document types |

### Production Readiness Summary

From `docs/15-prod-readiness.md`, confirmed by audit:

**Ready NOW**:
- AI Routing Engine
- Database Schema
- Email Notifications
- Webhook Receiver

**NOT Ready (Launch Blockers)**:
- Frontend Dashboard
- Stripe Billing
- User Authentication
- Legal Documents (on-site)

---

## Session 002 Audit Update - Feb 13-14, 2026

### Completion Assessment: ~85% (up from 20%)

| Area | Session 001 Status | Session 002 Status | Completion | Notes |
|------|-------------------|-------------------|------------|-------|
| AI Routing Engine | BUILT | BUILT | 100% | Unchanged -- still enterprise-grade |
| Database Schema | BUILT | EXPANDED | 100% | Added 4 new tables (passkeys x3, paymentSettings). Now 8 tables total. |
| HTTP Webhook Handler | BUILT | EXPANDED | 100% | Now has `/webhook/:secret`, `/stripe`, `/whop`, `/health` routes |
| Customer Management | BUILT (90%) | BUILT | 95% | Stripe webhook handler now exists |
| Recipient Management | BUILT | BUILT | 100% | Unchanged |
| Outbound Fax | BUILT | UPGRADED | 100% | Now supports file upload + cover page generation |
| Authentication | NOT BUILT (0%) | BUILT | 100% | Passkeys (WebAuthn) via `convex/passkeys.ts` + `hooks/use-passkey.ts` |
| Payments (Stripe) | NOT BUILT (0%) | BUILT | 90% | Checkout + subscription lifecycle in `convex/stripe.ts`. Billing portal TBD. |
| Payments (Whop) | N/A | BUILT | 90% | Backup processor in `convex/whop.ts`. Admin-toggleable. |
| Landing Page | PARTIAL (40%) | BUILT | 95% | Fully styled, pharmacy-niche copy, responsive |
| Dashboard UI | NOT BUILT (0%) | BUILT | 90% | Shell, sidebar, topbar, all pages built |
| Inbox (list + detail) | NOT BUILT | BUILT | 90% | List view + detail view with AI extraction display |
| Send Fax | NOT BUILT | BUILT | 90% | File upload + cover page + recipient selection |
| Sent History | NOT BUILT | BUILT | 90% | List + detail views |
| Recipients CRUD | NOT BUILT | BUILT | 95% | Full create/read/update/delete |
| Settings Page | NOT BUILT | BUILT | 85% | Account settings, fax credentials, notifications |
| Billing Page | NOT BUILT | BUILT | 85% | Plan display, upgrade flow, payment history |
| Legal Pages | NOT BUILT (0%) | BUILT | 100% | Privacy policy + terms of service (restyled) |
| Error Pages | NOT BUILT | BUILT | 100% | error.tsx, not-found.tsx, global-error.tsx |
| UI Components | NOT BUILT | BUILT | 95% | 11 components: button, input, badge, card, table, modal, toggle, loading, empty-state, file-upload, pdf-viewer |
| Notifications | NOT BUILT | BUILT | 90% | In-app notification system via `convex/notifications.ts` |
| Cover Page Gen | NOT BUILT | BUILT | 90% | `convex/coverPage.ts` |
| Fax Infrastructure | HumbleFax only | Faxbot cloned | 70% | Faxbot in `infra/faxbot/`, not yet deployed to VPS |
| Deployment | NOT DONE | CONFIGURED | 60% | Convex dev deployed. Cloudflare Pages configured but not live. |
| Testing | NOT BUILT (0%) | NOT BUILT | 0% | Still zero tests |
| Monitoring | NOT BUILT (0%) | NOT BUILT | 0% | No Sentry or error tracking |
| Help Center | NOT BUILT (0%) | NOT BUILT | 0% | No FAQ or help articles |

---

## Recommended Next Steps (Updated Feb 14, 2026)

Previous P0 items from Session 001 are now mostly COMPLETE. Updated priorities:

| Priority | Task | Status | Estimated Effort | Dependency |
|----------|------|--------|-----------------|------------|
| ~~P0-1~~ | ~~Implement authentication~~ | DONE (Passkeys) | -- | -- |
| ~~P0-2~~ | ~~Build Stripe checkout + webhook handler~~ | DONE | -- | -- |
| ~~P0-3~~ | ~~Build dashboard UI~~ | DONE | -- | -- |
| ~~P0-4~~ | ~~Polish landing page~~ | DONE (pharmacy niche) | -- | -- |
| ~~P1-1~~ | ~~Add legal pages~~ | DONE (privacy, terms) | -- | -- |
| P1-2 | Deploy Faxbot to Vultr VPS | NOT STARTED | 1-2 days | BulkVS account |
| P1-3 | Configure BulkVS SIP trunk | NOT STARTED | 0.5 days | Vultr VPS |
| P1-4 | Set up error monitoring (Sentry) | NOT STARTED | 0.5 days | None |
| P1-5 | Implement onboarding email sequence via EmailIt | NOT STARTED | 1 day | None |
| P1-6 | Write integration tests for routing flow | NOT STARTED | 1-2 days | None |
| P1-7 | Configure Stripe + Whop webhook secrets in Convex env vars | NOT STARTED | 0.5 days | None |
| P2-1 | Deploy frontend to Cloudflare Pages (go live) | NOT STARTED | 0.5 days | All P1 |
| P2-2 | Connect faxbella.com domain to Cloudflare | NOT STARTED | 0.5 days | P2-1 |
| P2-3 | Create demo video | NOT STARTED | 1 day | P2-1 |
| P2-4 | Fix FaxAI naming remnants in code | NOT STARTED | 0.5 days | None |
| P2-5 | Build help center / FAQ | NOT STARTED | 1 day | None |
| P2-6 | Add BAA download page | NOT STARTED | 0.5 days | None |
| P2-7 | Add Stripe billing portal integration | NOT STARTED | 0.5 days | P1-7 |

**Estimated remaining to launch-ready: 8-12 days of focused development.**

---

## File Inventory (as of Feb 14, 2026)

### Convex Backend Files (11 files)
```
convex/schema.ts               -- Database schema (8 tables, 18+ indexes)
convex/faxRouting.ts           -- AI routing engine (core value prop)
convex/http.ts                 -- HTTP router (/webhook/:secret, /stripe, /whop, /health)
convex/customers.ts            -- Customer CRUD + dashboard query
convex/recipients.ts           -- Recipient CRUD
convex/outboundFax.ts          -- Outbound fax sending (upgraded: file upload support)
convex/stripe.ts               -- Stripe checkout + subscription lifecycle [NEW]
convex/whop.ts                 -- Whop backup payment processor [NEW]
convex/passkeys.ts             -- WebAuthn passkey auth + sessions [NEW]
convex/notifications.ts        -- In-app notification system [NEW]
convex/coverPage.ts            -- Cover page generation [NEW]
```

### Frontend - App Pages
```
app/layout.tsx                 -- Root layout with ConvexClientProvider
app/page.tsx                   -- Landing page (pharmacy niche, fully styled)
app/sitemap.ts                 -- Dynamic sitemap generation [NEW]
app/error.tsx                  -- Error boundary [NEW]
app/not-found.tsx              -- 404 page [NEW]
app/global-error.tsx           -- Global error boundary [NEW]
app/ConvexClientProvider.tsx   -- Convex React provider wrapper
app/globals.css                -- Global styles (expanded)
app/(static)/privacy/page.tsx  -- Privacy policy [NEW]
app/(static)/terms/page.tsx    -- Terms of service [NEW]
app/auth/login/                -- Login page [NEW]
app/auth/signup/               -- Signup page [NEW]
app/pricing/                   -- Pricing page [NEW]
app/dashboard/                 -- Dashboard overview [NEW]
app/dashboard/inbox/           -- Fax inbox list + detail [NEW]
app/dashboard/send/            -- Send fax page [NEW]
app/dashboard/sent/            -- Sent history list + detail [NEW]
app/dashboard/recipients/      -- Recipients CRUD [NEW]
app/dashboard/settings/        -- Settings page [NEW]
app/dashboard/billing/         -- Billing page [NEW]
```

### Frontend - Components
```
components/ui/button            -- Button component [NEW]
components/ui/input             -- Input component [NEW]
components/ui/badge             -- Badge component [NEW]
components/ui/card              -- Card component [NEW]
components/ui/table             -- Table component [NEW]
components/ui/modal             -- Modal component [NEW]
components/ui/toggle            -- Toggle component [NEW]
components/ui/loading           -- Loading spinner [NEW]
components/ui/empty-state       -- Empty state display [NEW]
components/ui/file-upload       -- File upload component [NEW]
components/ui/pdf-viewer        -- PDF viewer component [NEW]
components/marketing/header     -- Site header [NEW]
components/marketing/footer     -- Site footer [NEW]
components/dashboard/shell      -- Dashboard layout shell [NEW]
components/dashboard/sidebar    -- Dashboard sidebar nav [NEW]
components/dashboard/topbar     -- Dashboard top bar [NEW]
```

### Hooks
```
hooks/use-passkey.ts           -- React hook for passkey auth [NEW]
```

### Infrastructure
```
infra/faxbot/                  -- Faxbot (FreeSWITCH) Docker-based fax server [NEW]
middleware.ts                  -- Security headers + route protection [NEW]
```

### Configuration Files
```
package.json                   -- Dependencies (Next.js 15, React 19, Convex, Stripe, Whop)
tsconfig.json                  -- TypeScript configuration
next.config.mjs                -- Next.js configuration
wrangler.toml                  -- Cloudflare Pages deployment config [NEW]
open-next.config.ts            -- OpenNext adapter for Cloudflare [NEW]
.gitignore                     -- Git ignore rules
.env.example                   -- Environment variable template
public/robots.txt              -- Search engine directives [NEW]
```

### Documentation Files (21 files)
```
docs/01-vision.md              -- Mission, values, roadmap
docs/02-problem.md             -- Market problem, cost analysis
docs/03-customer.md            -- ICP, personas, acquisition channels
docs/04-solution.md            -- Solution overview, ROI calculator
docs/05-features.md            -- Feature matrix, 14 features
docs/06-pricing.md             -- 3 tiers, ROI analysis, objections
docs/07-ux.md                  -- User flows, page designs, email templates
docs/08-tech.md                -- Architecture, schema, API design [UPDATED]
docs/09-security.md            -- HIPAA, encryption, vendor security
docs/10-legal.md               -- ToS, privacy, BAA, DPA
docs/11-metrics.md             -- KPIs, quarterly targets
docs/12-launch.md              -- Launch plan, marketing channels
docs/13-sales.md               -- Sales funnel, objection handling
docs/14-ops.md                 -- Support, billing, monitoring
docs/15-prod-readiness.md      -- Production checklist with status
docs/16-decisions.md           -- Key decisions log (25 entries) [UPDATED]
docs/projectreflog.md          -- Session reference log [UPDATED]
docs/projectchatandprompts.md  -- This file [UPDATED]
CLAUDE.md                      -- Claude Code instructions [UPDATED]
README.md                      -- Project overview and setup guide
```

---

*This document captures context that would otherwise be lost between sessions. It is append-only.*
