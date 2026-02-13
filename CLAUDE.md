# FaxBella - Claude Code Instructions

## Project Overview

FaxBella (faxbella.com) is an AI-powered fax routing SaaS platform built by Doclish Inc. It receives incoming faxes via HumbleFax, uses Google Gemini 2.0 Flash to analyze content (OCR, document classification, urgency detection, structured data extraction), and routes faxes to the correct recipient via email notification or webhook.

## Tech Stack

- **Frontend:** Next.js 15 (App Router, React 19)
- **Backend:** Convex (serverless functions, real-time database)
- **AI:** Google Gemini 2.0 Flash (OCR, document classification, routing)
- **Payments:** Stripe (primary), Whop (backup, admin-toggleable)
- **Fax Provider:** HumbleFax API
- **Auth:** WebAuthn Passkeys (convex/passkeys.ts, hooks/use-passkey.ts)
- **Deployment:** Cloudflare Pages/Workers via OpenNext
- **Domain:** faxbella.com

## Critical Rules

### Email Provider: EmailIt ONLY
- ALL email delivery MUST use EmailIt (api.emailit.com)
- NEVER use Resend, SendGrid, Postmark, or any other email provider
- This applies to fax notifications, confirmations, transactional emails, and all user communications
- API key: EMAILIT_API_KEY (stored in Convex env vars)

### Payment Processors
- Stripe is the primary payment processor
- Whop (whop.com) is the backup processor
- An admin toggle in convex/whop.ts controls which processor is active
- Never remove either processor; they must coexist

### Authentication
- Passkey-based (WebAuthn) via convex/passkeys.ts
- Session tokens stored in localStorage (key: faxbella_session)
- Middleware protects /dashboard, /settings, /api/protected routes

## Project Structure

```
faxbella/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with ConvexClientProvider
│   ├── page.tsx                  # Landing page
│   ├── sitemap.ts                # Dynamic sitemap generation
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx             # 404 page
│   ├── global-error.tsx          # Global error boundary
│   ├── ConvexClientProvider.tsx   # Convex React client setup
│   ├── globals.css               # Global styles
│   └── (static)/                 # Static legal pages
│       ├── privacy/page.tsx
│       └── terms/page.tsx
├── convex/                       # Convex backend
│   ├── schema.ts                 # Database schema (customers, recipients, faxes, passkeys, payments)
│   ├── customers.ts              # Customer CRUD and dashboard data
│   ├── recipients.ts             # Recipient management
│   ├── faxRouting.ts             # Core AI routing engine
│   ├── outboundFax.ts            # Sending faxes via HumbleFax
│   ├── passkeys.ts               # WebAuthn passkey auth + sessions
│   ├── whop.ts                   # Whop payment processor (backup)
│   └── http.ts                   # HTTP webhook handlers
├── hooks/
│   └── use-passkey.ts            # React hook for passkey auth
├── middleware.ts                 # Security headers + route protection
├── public/
│   └── robots.txt                # Search engine directives
├── wrangler.toml                 # Cloudflare Pages deployment config
├── open-next.config.ts           # OpenNext adapter for Cloudflare
├── .env.example                  # Environment variable documentation
├── package.json
├── tsconfig.json
└── next.config.mjs
```

## Database Tables (Convex)

- **customers** - SaaS customer accounts (email, plan, Stripe IDs, HumbleFax credentials)
- **recipients** - Fax recipients within customer organizations
- **inboundFaxes** - Processed incoming faxes with AI extraction data
- **outboundFaxes** - Sent faxes
- **passkeyCredentials** - WebAuthn public key credentials
- **passkeyChallenge** - Temporary registration/auth challenges
- **passkeySessions** - Active user sessions
- **paymentSettings** - Global payment processor toggle (Stripe vs Whop)

## Environment Variables

All secrets are stored in Convex Dashboard (Settings > Environment Variables):
- `HUMBLEFAX_ACCESS_KEY` - HumbleFax API access
- `HUMBLEFAX_SECRET_KEY` - HumbleFax API secret
- `GEMINI_API_KEY` - Google Gemini AI
- `EMAILIT_API_KEY` - EmailIt email delivery
- `STRIPE_SECRET_KEY` - Stripe payments
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook verification
- `WHOP_API_KEY` - Whop backup payments
- `WHOP_WEBHOOK_SECRET` - Whop webhook verification

Client-side (.env.local):
- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key

## Coding Standards

- Use TypeScript strict mode
- Convex files use `@ts-nocheck` header (types generated at deploy time)
- Prefer editing existing files over creating new ones
- No emojis in code comments (emojis OK in user-facing email HTML)
- All email sending goes through EmailIt API exclusively
- Security headers applied via middleware.ts on every request
