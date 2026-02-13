# FaxBella Technical Architecture

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 (App Router) | React-based web application |
| **Backend** | Convex | Serverless functions + real-time database |
| **AI/OCR** | Google Gemini 2.0 Flash | PDF analysis, text extraction, routing logic |
| **Payments** | Stripe | Subscriptions, checkout |
| **Fax Provider** | HumbleFax | Inbound/outbound fax infrastructure |
| **Email** | EmailIt | Transactional email delivery |
| **Hosting** | Cloudflare Pages + Convex Cloud | Global edge deployment |
| **Domain** | faxbella.com | Primary domain |

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FAXBELLA ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │  HumbleFax  │
                              │   Server    │
                              └──────┬──────┘
                                     │ Webhook (fax received)
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CONVEX CLOUD                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                        HTTP Router                              │ │
│  │  POST /inbound-fax → Validate webhook → Queue for processing   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                │                                     │
│                                ▼                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Internal Action:                             │ │
│  │                 processInboundFaxWithAI                         │ │
│  │  1. Download PDF from HumbleFax                                 │ │
│  │  2. Send to Gemini for OCR + analysis                          │ │
│  │  3. Extract: recipient, docType, urgency, structuredData        │ │
│  │  4. Match to registered recipient                               │ │
│  │  5. Store PDF in Convex storage                                 │ │
│  │  6. Update inboundFaxes table                                   │ │
│  │  7. Send email notification via EmailIt                         │ │
│  │  8. Optional: Send webhook to customer endpoint                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                │                                     │
│                                ▼                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                      CONVEX TABLES                              │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │ │
│  │  │  customers  │ │ recipients  │ │inboundFaxes │               │ │
│  │  │  - email    │ │ - name      │ │ - fromNumber│               │ │
│  │  │  - plan     │ │ - email     │ │ - docType   │               │ │
│  │  │  - stripe   │ │ - keywords  │ │ - urgency   │               │ │
│  │  │  - webhook  │ │ - delivery  │ │ - routed_to │               │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘               │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐                          ┌─────────────────┐
│    EmailIt      │                          │ Cloudflare Pages│
│  (Notification) │                          │  (Next.js App)  │
└─────────────────┘                          └─────────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────┐                          ┌─────────────────┐
│   Recipient     │                          │    Dashboard    │
│   Email Inbox   │                          │    (Browser)    │
└─────────────────┘                          └─────────────────┘
```

## Database Schema

### Tables

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
  providerFaxId: string,     // HumbleFax fax ID
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
```

## API Design

### HTTP Endpoints (Convex HTTP Router)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/inbound-fax` | HumbleFax webhook receiver |
| POST | `/stripe-webhook` | Stripe payment events |

### Convex Mutations

| Function | Description |
|----------|-------------|
| `customers.create` | Create new customer after Stripe checkout |
| `customers.update` | Update customer settings |
| `recipients.add` | Add recipient to customer account |
| `recipients.update` | Update recipient details |
| `recipients.remove` | Remove recipient |
| `faxRouting.updateInboundFax` | Update fax record after processing |

### Convex Queries

| Function | Description |
|----------|-------------|
| `customers.get` | Get current customer |
| `recipients.list` | List all recipients for customer |
| `inboundFaxes.list` | List faxes with filters |
| `inboundFaxes.get` | Get single fax details |
| `inboundFaxes.getUnroutable` | Get unroutable queue |

### Convex Actions

| Function | Description |
|----------|-------------|
| `faxRouting.processInboundFaxWithAI` | Main AI routing action |
| `outboundFax.send` | Send outbound fax via HumbleFax |

## AI Processing Pipeline

```typescript
// 1. Receive webhook
POST /inbound-fax {
  faxId: "abc123",
  from: "+15551234567",
  to: "+15559876543",
  pages: 3,
  timestamp: "2026-01-15T14:30:00Z"
}

// 2. Queue for processing
ctx.scheduler.runAfter(0, internal.faxRouting.processInboundFaxWithAI, {
  inboundFaxId,
  humbleFaxId: faxId,
  fromNumber: from,
});

// 3. Download PDF
const pdf = await fetch(`https://api.humblefax.com/fax/${faxId}/download`, {
  headers: { Authorization: `Basic ${credentials}` }
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

// 7. Send notification
await sendEmailNotification(recipientEmail, faxData);
```

## Deployment

### Cloudflare Pages
- Source: GitHub repo
- Build command: `npm run build`
- Output: `.open-next/assets`
- Environment: Production

### Convex Cloud
- Deployment: `npx convex deploy`
- Environment variables managed in Convex dashboard

### Environment Variables

```bash
# Convex
CONVEX_DEPLOYMENT=<prod-deployment-id>

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# HumbleFax
HUMBLEFAX_ACCESS_KEY=...
HUMBLEFAX_SECRET_KEY=...

# Gemini AI
GEMINI_API_KEY=...

# EmailIt
EMAILIT_API_KEY=...
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

## Monitoring & Logging

- **Convex Dashboard**: Function logs, errors, metrics
- **Cloudflare Analytics**: Traffic, performance
- **Stripe Dashboard**: Payment events
- **Custom**: `console.log` with structured JSON for analysis

---

*Architecture designed for speed, reliability, and scale.*
