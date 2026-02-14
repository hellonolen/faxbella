# FaxBella Technical Architecture

## Tech Stack

| Layer | Technology | Purpose | Status |
|-------|------------|---------|--------|
| **Frontend** | Next.js 15 (App Router) | React-based web application | Active |
| **Backend** | Convex | Serverless functions + real-time database | Active |
| **AI/OCR** | Google Gemini 2.0 Flash | PDF analysis, text extraction, routing logic | Active |
| **Auth** | Passkeys (WebAuthn) | Passwordless authentication via `convex/passkeys.ts` + `hooks/use-passkey.ts` | Active |
| **Payments (Primary)** | Stripe | Subscriptions, checkout via `convex/stripe.ts` | Active |
| **Payments (Backup)** | Whop | Backup payment processor, admin-toggleable via `convex/whop.ts` | Active |
| **Fax Provider (Primary)** | Faxbot (FreeSWITCH) | Self-hosted Docker-based fax server at `infra/faxbot/`. REST API + HIPAA compliant. | Active (not yet deployed) |
| **Fax Provider (Legacy)** | HumbleFax | Inbound/outbound fax API. Code remains in codebase but NOT active. Kept as fallback. | Legacy (not active) |
| **SIP Trunk** | BulkVS | SIP trunk provider ($0.0003/min inbound, $0.004/min outbound) | Selected |
| **Email** | EmailIt | Transactional email delivery (ONLY provider — never Resend/SendGrid) | Active |
| **Hosting (Frontend)** | Cloudflare Pages | Global edge deployment via OpenNext | Configured |
| **Hosting (Backend)** | Convex Cloud | Serverless backend (dev: impartial-chicken-456) | Active |
| **Hosting (Fax Server)** | Vultr VPS | $20/mo, HIPAA BAA available, for Faxbot Docker container | Selected |
| **Domain** | faxbella.com | Primary domain | Registered |

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          FAXBELLA ARCHITECTURE (v2)                       │
└──────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐         ┌──────────────┐
  │   BulkVS     │         │  HumbleFax   │
  │  SIP Trunk   │         │  (legacy,    │
  │  Provider    │         │   inactive)  │
  └──────┬───────┘         └──────────────┘
         │ SIP/T.38
         ▼
  ┌──────────────┐
  │   Faxbot     │  (Vultr VPS, Docker)
  │  FreeSWITCH  │  REST API + HIPAA
  │  + REST API  │
  └──────┬───────┘
         │ Webhook (fax received)
         ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         CONVEX CLOUD                                      │
│                  (dev: impartial-chicken-456)                              │
│                  https://impartial-chicken-456.convex.site                 │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                        HTTP Router (convex/http.ts)                   │ │
│  │  POST /webhook/:secret  → Inbound fax webhook (per-tenant)          │ │
│  │  POST /stripe           → Stripe payment events                      │ │
│  │  POST /whop             → Whop payment events                        │ │
│  │  GET  /health           → Health check endpoint                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                │                                          │
│                                ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                    Internal Action:                                   │ │
│  │                 processInboundFaxWithAI                               │ │
│  │  1. Download PDF from Faxbot REST API                                │ │
│  │  2. Send to Gemini for OCR + analysis                                │ │
│  │  3. Extract: recipient, docType, urgency, structuredData             │ │
│  │  4. Match to registered recipient                                    │ │
│  │  5. Store PDF in Convex storage                                      │ │
│  │  6. Update inboundFaxes table                                        │ │
│  │  7. Create in-app notification (convex/notifications.ts)             │ │
│  │  8. Send email notification via EmailIt                              │ │
│  │  9. Optional: Send webhook to customer endpoint                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                │                                          │
│                                ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                      CONVEX TABLES (8 tables)                        │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │ │
│  │  │  customers   │ │  recipients  │ │ inboundFaxes │                 │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                 │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │ │
│  │  │outboundFaxes │ │  passkey*    │ │paymentSettings│                │ │
│  │  │(+ file upload)│ │  (3 tables) │ │(Stripe/Whop) │                 │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                 │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
         │                    │                              │
         ▼                    ▼                              ▼
┌─────────────────┐  ┌─────────────────┐          ┌─────────────────┐
│    EmailIt      │  │   Stripe /      │          │ Cloudflare Pages│
│  (Notification) │  │   Whop          │          │  (Next.js App)  │
└─────────────────┘  │  (Payments)     │          │  via OpenNext   │
         │           └─────────────────┘          └─────────────────┘
         ▼                                                │
┌─────────────────┐                              ┌─────────────────┐
│   Recipient     │                              │    Dashboard    │
│   Email Inbox   │                              │    (Browser)    │
└─────────────────┘                              │  Passkey Auth   │
                                                 └─────────────────┘
```

## Database Schema

### Tables (8 total)

```typescript
// customers - SaaS customers (businesses)
customers: {
  email: string,
  name: string,
  stripeCustomerId: string,
  stripeSubscriptionId?: string,
  plan: 'starter' | 'business' | 'enterprise',
  humbleFaxKey?: string,     // Optional: customer's own credentials
  humbleFaxSecret?: string,
  webhookSecret: string,     // Unique per customer for webhook verification
  monthlyFaxCount: number,
  billingPeriodStart: number,
  createdAt: number,
  updatedAt: number,
}

// recipients - People who receive faxes
recipients: {
  customerId: Id<'customers'>,
  name: string,
  email: string,
  keywords: string[],        // Routing keywords
  department?: string,
  company?: string,
  deliveryMethod: 'email' | 'webhook',
  webhookUrl?: string,
  isActive: boolean,
  createdAt: number,
  updatedAt: number,
}

// inboundFaxes - Processed faxes with enhanced AI fields
inboundFaxes: {
  customerId: Id<'customers'>,
  providerFaxId: string,     // Fax provider fax ID
  fromNumber: string,
  toNumber: string,
  numPages: number,

  // Routing
  status: 'pending' | 'processing' | 'routed' | 'unroutable' | 'error',
  routedToRecipientId?: Id<'recipients'>,
  routingConfidence?: number,
  routingReason?: string,

  // AI extracted data
  extractedText?: string,
  documentType?: string,     // referral, prescription_refill, lab_results, etc.
  urgency?: string,          // urgent, routine, low
  urgencyReason?: string,
  structuredData?: {
    patientName?: string,
    patientDOB?: string,
    patientMRN?: string,
    senderName?: string,
    senderOrganization?: string,
    senderPhone?: string,
    referralType?: string,
    prescriptionDrug?: string,
    invoiceNumber?: string,
    insuranceProvider?: string,
    authorizationNumber?: string,
  },

  // Multi-document splitting
  parentFaxId?: Id<'inboundFaxes'>,
  splitIndex?: number,
  totalSplits?: number,

  // Storage
  storageId?: Id<'_storage'>,

  // Webhook delivery
  webhookDelivered?: boolean,
  webhookDeliveredAt?: number,

  // Timestamps
  receivedAt: number,
  processedAt?: number,
  createdAt: number,
}

// outboundFaxes - Sent faxes (upgraded with file upload support)
outboundFaxes: {
  customerId: Id<'customers'>,
  toNumber: string,
  fromNumber?: string,
  status: 'pending' | 'sending' | 'sent' | 'failed',
  storageId?: Id<'_storage'>,     // Uploaded file for faxing
  coverPageId?: Id<'_storage'>,   // Generated cover page
  numPages?: number,
  providerFaxId?: string,
  errorMessage?: string,
  createdAt: number,
  updatedAt: number,
}

// passkeyCredentials - WebAuthn public key credentials
passkeyCredentials: {
  userId: Id<'customers'>,
  credentialId: string,        // Base64-encoded credential ID
  publicKey: string,           // Base64-encoded public key
  counter: number,             // Signature counter for replay protection
  transports?: string[],       // Authenticator transport hints
  createdAt: number,
}

// passkeyChallenge - Temporary registration/authentication challenges
passkeyChallenge: {
  challenge: string,           // Base64-encoded challenge bytes
  type: 'registration' | 'authentication',
  userId?: Id<'customers'>,    // Set for registration challenges
  expiresAt: number,           // TTL for challenge validity
  createdAt: number,
}

// passkeySessions - Active user sessions
passkeySessions: {
  userId: Id<'customers'>,
  token: string,               // Session token stored in localStorage
  expiresAt: number,
  createdAt: number,
}

// paymentSettings - Global payment processor configuration
paymentSettings: {
  activeProcessor: 'stripe' | 'whop',
  stripeEnabled: boolean,
  whopEnabled: boolean,
  updatedAt: number,
}
```

### Indexes

```typescript
// Customers
customers.by_email: [email]
customers.by_stripe: [stripeCustomerId]

// Recipients
recipients.by_customer: [customerId]
recipients.by_email: [customerId, email]

// Inbound Faxes
inboundFaxes.by_customer: [customerId]
inboundFaxes.by_customer_status: [customerId, status]
inboundFaxes.by_customer_urgency: [customerId, urgency]
inboundFaxes.by_customer_documentType: [customerId, documentType]
inboundFaxes.by_providerFaxId: [providerFaxId]
inboundFaxes.by_parentFax: [parentFaxId]

// Outbound Faxes
outboundFaxes.by_customer: [customerId]
outboundFaxes.by_customer_status: [customerId, status]

// Passkey Credentials
passkeyCredentials.by_userId: [userId]
passkeyCredentials.by_credentialId: [credentialId]

// Passkey Challenges
passkeyChallenge.by_challenge: [challenge]

// Passkey Sessions
passkeySessions.by_token: [token]
passkeySessions.by_userId: [userId]

// Payment Settings
paymentSettings.by_activeProcessor: [activeProcessor]
```

## API Design

### HTTP Endpoints (Convex HTTP Router)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/webhook/:secret` | Inbound fax webhook receiver (per-tenant secret in URL) |
| POST | `/stripe` | Stripe payment events (checkout, subscription lifecycle) |
| POST | `/whop` | Whop payment events (backup processor) |
| GET | `/health` | Health check endpoint |

### Convex Mutations

| Function | File | Description |
|----------|------|-------------|
| `customers.create` | `convex/customers.ts` | Create new customer after payment checkout |
| `customers.update` | `convex/customers.ts` | Update customer settings |
| `recipients.add` | `convex/recipients.ts` | Add recipient to customer account |
| `recipients.update` | `convex/recipients.ts` | Update recipient details |
| `recipients.remove` | `convex/recipients.ts` | Remove recipient |
| `faxRouting.updateInboundFax` | `convex/faxRouting.ts` | Update fax record after processing |
| `passkeys.storeCredential` | `convex/passkeys.ts` | Store WebAuthn credential after registration |
| `passkeys.createSession` | `convex/passkeys.ts` | Create session after successful authentication |
| `passkeys.deleteSession` | `convex/passkeys.ts` | Log out / invalidate session |
| `stripe.handleCheckout` | `convex/stripe.ts` | Process Stripe checkout completion |
| `stripe.handleSubscription` | `convex/stripe.ts` | Handle subscription lifecycle events |
| `whop.handlePayment` | `convex/whop.ts` | Process Whop payment events |
| `whop.toggleProcessor` | `convex/whop.ts` | Admin toggle between Stripe and Whop |
| `notifications.create` | `convex/notifications.ts` | Create in-app notification |
| `notifications.markRead` | `convex/notifications.ts` | Mark notification as read |
| `coverPage.generate` | `convex/coverPage.ts` | Generate fax cover page |

### Convex Queries

| Function | File | Description |
|----------|------|-------------|
| `customers.get` | `convex/customers.ts` | Get current customer |
| `customers.getDashboard` | `convex/customers.ts` | Get dashboard overview data |
| `recipients.list` | `convex/recipients.ts` | List all recipients for customer |
| `inboundFaxes.list` | `convex/faxRouting.ts` | List faxes with filters |
| `inboundFaxes.get` | `convex/faxRouting.ts` | Get single fax details |
| `inboundFaxes.getUnroutable` | `convex/faxRouting.ts` | Get unroutable queue |
| `passkeys.getSession` | `convex/passkeys.ts` | Validate session token |
| `passkeys.getCredentials` | `convex/passkeys.ts` | Get user's registered passkeys |
| `notifications.list` | `convex/notifications.ts` | List user notifications |
| `whop.getPaymentSettings` | `convex/whop.ts` | Get active payment processor setting |

### Convex Actions

| Function | File | Description |
|----------|------|-------------|
| `faxRouting.processInboundFaxWithAI` | `convex/faxRouting.ts` | Main AI routing action |
| `outboundFax.send` | `convex/outboundFax.ts` | Send outbound fax (supports file upload) |
| `passkeys.generateChallenge` | `convex/passkeys.ts` | Generate WebAuthn challenge |
| `stripe.createCheckoutSession` | `convex/stripe.ts` | Create Stripe checkout session |

## AI Processing Pipeline

```typescript
// 1. Receive webhook from Faxbot
POST /webhook/:secret {
  faxId: "abc123",
  from: "+15551234567",
  to: "+15559876543",
  pages: 3,
  timestamp: "2026-01-15T14:30:00Z"
}

// 2. Queue for processing
ctx.scheduler.runAfter(0, internal.faxRouting.processInboundFaxWithAI, {
  inboundFaxId,
  faxId: faxId,
  fromNumber: from,
});

// 3. Download PDF from Faxbot REST API
const pdf = await fetch(`https://<faxbot-host>/api/fax/${faxId}/download`, {
  headers: { Authorization: `Bearer ${apiToken}` }
});

// 4. Send to Gemini
const response = await fetch(GEMINI_API_URL, {
  method: 'POST',
  body: JSON.stringify({
    contents: [{
      parts: [
        { text: ROUTING_PROMPT },
        { inline_data: { mime_type: 'application/pdf', data: pdfBase64 } }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    }
  })
});

// 5. Parse AI response
const analysis = {
  extractedText: "...",
  documentType: "referral",
  urgency: "urgent",
  urgencyReason: "STAT referral",
  matchedRecipientEmail: "dr.smith@clinic.com",
  confidence: 0.95,
  reason: "Matched 'Dr. Smith' in content",
  structuredData: { ... }
};

// 6. Route to recipient
await ctx.runMutation(internal.faxRouting.updateInboundFax, {
  id: inboundFaxId,
  status: 'routed',
  routedToRecipientId: matchedRecipient._id,
  ...analysis
});

// 7. Create in-app notification
await ctx.runMutation(internal.notifications.create, {
  customerId, type: 'fax_routed', faxId: inboundFaxId
});

// 8. Send email notification
await sendEmailNotification(recipientEmail, faxData);
```

## Deployment

### Cloudflare Pages (NOT Workers)

| Setting | Value |
|---------|-------|
| Platform | Cloudflare Pages via OpenNext |
| Config file | `wrangler.toml` |
| Build output | `pages_build_output_dir = ".open-next"` |
| Adapter | `open-next.config.ts` (@opennextjs/cloudflare) |
| Build command | `npm run build` (produces `.open-next/` directory) |
| Environment | Production |

### Convex Cloud

| Setting | Value |
|---------|-------|
| Deployment | `dev:impartial-chicken-456` |
| Team | `dr-nolen` |
| Project | `faxbella-f39e8` |
| HTTP URL | `https://impartial-chicken-456.convex.site` |
| Deploy command | `npx convex deploy` |
| Env vars | Managed in Convex Dashboard (Settings > Environment Variables) |

### Fax Server (Faxbot)

| Setting | Value |
|---------|-------|
| Software | Faxbot (github.com/DMontgomery40/Faxbot) |
| Runtime | Docker container |
| Engine | FreeSWITCH + REST API |
| Location | `infra/faxbot/` in repo |
| Host | Vultr VPS ($20/mo, HIPAA BAA) |
| SIP Trunk | BulkVS ($0.0003/min inbound, $0.004/min outbound) |
| Status | Cloned, not yet deployed |

### Environment Variables

```bash
# Convex (stored in Convex Dashboard)
CONVEX_DEPLOYMENT=dev:impartial-chicken-456

# Stripe
STRIPE_SECRET_KEY=[SET]
STRIPE_WEBHOOK_SECRET=[SET]

# Whop (backup payment processor)
WHOP_API_KEY=[SET]
WHOP_WEBHOOK_SECRET=[SET]

# HumbleFax (legacy — credentials retained for fallback)
HUMBLEFAX_ACCESS_KEY=[SET]
HUMBLEFAX_SECRET_KEY=[SET]

# Gemini AI
GEMINI_API_KEY=[SET]

# EmailIt
EMAILIT_API_KEY=[SET]

# Client-side (.env.local)
NEXT_PUBLIC_CONVEX_URL=https://impartial-chicken-456.convex.cloud
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[SET]
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Webhook response | <200ms |
| PDF download | <2s |
| AI processing | <10s |
| Email delivery | <5s |
| **Total fax-to-inbox** | **<30s** |
| Dashboard load | <1s |
| API response | <100ms |
| Passkey auth | <2s |

## Monitoring & Logging

| Tool | Purpose |
|------|---------|
| Convex Dashboard | Function logs, errors, metrics |
| Cloudflare Analytics | Traffic, performance |
| Stripe Dashboard | Payment events, subscription status |
| Whop Dashboard | Backup payment events |
| Custom | `console.log` with structured JSON for analysis |
| Future | Sentry for error tracking (not yet configured) |

---

*Architecture designed for speed, reliability, and scale. Updated Feb 14, 2026.*
