# FaxBella Key Decisions Log

## Overview

This document tracks all major architectural, technical, business, and strategic decisions made during the development of FaxBella. Decisions are logged chronologically and never deleted -- only superseded when a new direction is chosen.

---

## Decision Log

| # | Date | Decision | Category | Rationale | Alternatives Considered | Status |
|---|------|----------|----------|-----------|------------------------|--------|
| D-001 | Feb 2026 | Use **Google Gemini 2.0 Flash** as the AI/OCR engine | Technical / AI | Fast inference speed (<10s per fax), cost-effective for high-volume processing, native PDF analysis with inline_data support, structured JSON output via responseMimeType, low temperature (0.1) for deterministic routing. Google does not train on Gemini API inputs, which supports HIPAA compliance. | OpenAI GPT-4V (higher cost, slower), Claude (no native PDF vision at decision time), Tesseract OCR + rules engine (no intelligence), AWS Textract (no routing logic) | Active |
| D-002 | Feb 2026 | Use **HumbleFax** as the fax provider | Technical / Infrastructure | Provides both inbound and outbound fax API with webhook support. Webhook payload includes fax metadata (fromNumber, toNumber, numPages, faxId). HIPAA-compliant with BAA available. Supports per-customer webhook URLs for multi-tenant routing. | Twilio Fax (deprecated), eFax API (limited webhook support), SRFax (less modern API), Phaxio (pricing concerns) | Active |
| D-003 | Feb 2026 | Use **EmailIt** as the ONLY email delivery provider | Technical / Email | Enforced as project policy -- no other email providers (Resend, SendGrid, Postmark) are permitted. Supports TLS encryption, HIPAA-aware delivery, DKIM/SPF verification for faxbella.com sender domain. Cost-effective for transactional email at scale. | Resend (explicitly banned), SendGrid (explicitly banned), Postmark, AWS SES | Active |
| D-004 | Feb 2026 | Use **Convex** as the backend platform | Technical / Backend | Serverless functions with real-time database, built-in file storage for PDF faxes, scheduler for async AI processing (runAfter), internal actions/mutations/queries for secure multi-step workflows, automatic scaling, SOC 2 Type II certified with HIPAA BAA available. | Supabase (less integrated scheduler), Firebase (vendor lock-in concerns), custom Node.js server (more ops overhead), PlanetScale + Vercel (more moving parts) | Active |
| D-005 | Feb 2026 | Use **Convex scheduler** for async AI processing | Technical / Architecture | Webhook endpoint responds in <200ms by storing the fax record and scheduling AI processing via `ctx.scheduler.runAfter(0, ...)`. This decouples the webhook response from the 10-30 second AI analysis, preventing HumbleFax webhook timeouts. | Direct synchronous processing (would timeout), External queue (Redis/SQS -- unnecessary complexity), Cron polling (too slow) | Active |
| D-006 | Feb 2026 | Adopt **competitor-inspired AI routing features** from industry leaders | Product / Strategy | FaxBella's AI engine draws directly from capabilities of Concord Technologies, eFax Clarity, ETHERFAX AI Insights, Phelix AI, and Medsender AI. This includes document classification (12 types), urgency detection (3 levels), structured data extraction (patient, sender, insurance fields), and multi-patient splitting. Competitive parity with enterprise solutions at SMB pricing. | Basic OCR + keyword matching only (too simplistic), Build features organically (too slow to market) | Active |
| D-007 | Feb 2026 | Multi-tenant architecture with **per-customer webhook secrets** | Technical / Security | Each customer gets a unique webhook URL (`/webhook/{secret}`) that identifies their account. This allows multiple businesses to share the same Convex deployment while keeping data isolated. Webhook secrets are generated with 32 chars from a safe character set. | JWT tokens in headers (more complex for HumbleFax config), API keys as query params (less secure), Separate deployments per customer (not scalable) | Active |
| D-008 | Feb 2026 | **Stripe** for all payment processing | Business / Payments | Industry standard for SaaS subscriptions. Supports 3 pricing tiers ($29/$99/$299), annual billing discounts (17%), free trials (14-day), and webhook events for subscription lifecycle. PCI DSS compliant. | Paddle (less control), LemonSqueezy (newer, less proven), direct invoicing (not scalable) | Active |
| D-009 | Feb 2026 | **Next.js 15 with App Router** for the frontend | Technical / Frontend | Latest stable Next.js with React 19 support, server components for performance, App Router for modern file-based routing. Deploys to Cloudflare Pages for global edge delivery. | Remix (smaller ecosystem), SvelteKit (team unfamiliar), plain React SPA (no SSR/SEO) | Active |
| D-010 | Feb 2026 | **Cloudflare Pages** for frontend hosting | Technical / Deployment | Global edge network for fast page loads, free SSL, DDoS protection, SOC 2 and ISO 27001 certified, HIPAA BAA available. Cost-effective for early-stage SaaS. | Vercel (higher cost at scale), AWS Amplify (more complex), self-hosted (ops burden) | Active |
| D-011 | Feb 2026 | **Three-tier pricing** model: Starter ($29), Business ($99), Enterprise ($299) | Business / Pricing | Value-based pricing at ~10% of customer savings ($990/month labor cost reduction). Starter captures small practices, Business is the target tier for multi-provider practices, Enterprise for large healthcare groups. No per-fax charges -- flat monthly rate for predictability. | Usage-based pricing (unpredictable for customers), single tier (leaves money on table), freemium (devalues product) | Active |
| D-012 | Feb 2026 | **Backend-first development** strategy | Process / Strategy | Build the AI routing engine, database schema, and webhook pipeline first. Frontend dashboard, auth, and payments are deferred. Rationale: the AI routing is the core value and the hardest technical problem. Proving it works validates the entire product. | Frontend-first (looks good but no substance), full-stack parallel (resource constrained) | Active |
| D-013 | Feb 2026 | Operate under **Doclish Inc.** entity | Business / Legal | FaxBella operates as a product under the existing Doclish Inc. corporate entity. Avoids overhead of new incorporation while still providing legal protection. Delaware jurisdiction. | New standalone LLC, C-corp incorporation, sole proprietorship (no liability protection) | Active |
| D-014 | Feb 2026 | HIPAA compliance as **architectural requirement**, not a checkbox | Business / Compliance | Privacy by design: AI processes and forgets (no PHI stored long-term), encryption at rest (AES-256) and in transit (TLS 1.3), BAA available for all paid plans, vendor BAAs maintained with Convex/Cloudflare/HumbleFax. Data retention: 1 year for faxes, 7 years for audit logs. | Basic compliance (minimum viable), delay compliance to post-launch (risky for healthcare market) | Active |
| D-015 | Feb 2026 | Allow customers to **bring their own API keys** (HumbleFax and Gemini) | Technical / Flexibility | Schema supports optional `humbleFaxAccessKey`, `humbleFaxSecretKey`, and `geminiApiKey` per customer. Falls back to platform credentials if not provided. Gives enterprise customers control over their own accounts and billing. | Platform-only credentials (limits enterprise adoption), mandatory customer keys (too complex for small practices) | Active |
| D-016 | Feb 2026 | **Self-serve primary, sales-assisted secondary** go-to-market | Business / Sales | 80% of customers should self-serve (landing page, trial, Stripe checkout, automated onboarding emails). Sales-assisted path reserved for Enterprise deals ($299+/month) with discovery calls, demos, BAA negotiation. | Fully self-serve (misses enterprise), fully sales-led (doesn't scale), PLG only (slow for healthcare) | Active |
| D-017 | Feb 2026 | Use **faxbella.com** as primary domain | Business / Brand | Clean, memorable domain that combines "fax" with "bella" (beautiful in Italian) -- conveying elegant fax management. Professional enough for healthcare market. | faxai.com (taken), smartfax.io (generic), faxrouter.com (too literal) | Active |

---

## Decision Categories

| Category | Count | Description |
|----------|-------|-------------|
| Technical / AI | 1 | AI model and processing decisions |
| Technical / Infrastructure | 1 | Fax provider and external service choices |
| Technical / Email | 1 | Email delivery provider |
| Technical / Backend | 1 | Backend platform and database |
| Technical / Architecture | 1 | System design patterns |
| Technical / Security | 1 | Authentication and data isolation |
| Technical / Frontend | 1 | Frontend framework |
| Technical / Deployment | 1 | Hosting and deployment |
| Technical / Flexibility | 1 | Customer configuration options |
| Product / Strategy | 1 | Feature set and competitive positioning |
| Business / Payments | 1 | Payment processing |
| Business / Pricing | 1 | Pricing model and tiers |
| Business / Legal | 1 | Corporate structure |
| Business / Compliance | 1 | HIPAA and regulatory |
| Business / Sales | 1 | Go-to-market strategy |
| Business / Brand | 1 | Domain and naming |
| Process / Strategy | 1 | Development approach |

---

## Key Constraints (Non-Negotiable)

These are hard constraints that override all other decisions:

1. **EmailIt is the ONLY email provider.** Never use Resend, SendGrid, or any alternative. Enforced in code comments and README.
2. **HIPAA compliance is mandatory.** Every vendor must support BAAs. Every data flow must be encrypted.
3. **HumbleFax is the fax provider.** Platform credentials are shared; customers can optionally bring their own.
4. **Gemini 2.0 Flash is the AI engine.** Low temperature (0.1) for deterministic outputs. JSON response format enforced.
5. **Convex is the backend.** No migration path planned. Deep integration with scheduler, storage, and real-time queries.

---

## Superseded Decisions

*None yet. All decisions are currently active.*

---

*Decisions drive architecture. Architecture drives outcomes. Document both.*
