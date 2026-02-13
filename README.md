# FaxBella - AI-Powered Fax Routing SaaS

A turnkey cloud solution that uses AI to intelligently route incoming faxes to the correct recipient. Built with Next.js 15, Convex, and Stripe. **Domain: faxbella.com**

## 🎯 Product Overview

**The Problem:** Businesses receive faxes on a shared number with no automatic way to route them to individual recipients.

**The Solution:** FaxBella uses Gemini AI to read incoming faxes, identify the intended recipient, and automatically deliver them to the right person's inbox.

## 🚀 How It Works For Customers

1. **Sign Up** - Enter email, payment info
2. **Connect Fax Provider** - Enter their HumbleFax credentials (or we provision for them)
3. **Add Recipients** - Name, email, optional keywords
4. **Done** - Faxes automatically route to the right person

## 💰 Pricing Model

| Plan | Price | Features |
|------|-------|----------|
| Starter | $29/mo | 100 faxes/mo, 5 recipients, email delivery |
| Business | $99/mo | 500 faxes/mo, 25 recipients, webhook delivery |
| Enterprise | $299/mo | Unlimited faxes, unlimited recipients, API access |

## 🏗️ Tech Stack

- **Frontend:** Next.js 15 (App Router)
- **Backend:** Convex (serverless functions + database)
- **AI:** Google Gemini 2.0 Flash
- **Payments:** Stripe
- **Fax Provider:** HumbleFax API
- **Deployment:** Cloudflare Pages + Convex Cloud

## 📁 Project Structure

```
faxbella/
├── app/                      # Next.js pages
│   ├── page.tsx              # Landing page
│   ├── dashboard/            # Customer dashboard
│   ├── api/                  # API routes
│   └── auth/                 # Auth pages
├── convex/                   # Convex backend
│   ├── schema.ts             # Database schema
│   ├── customers.ts          # Customer management
│   ├── recipients.ts         # Recipient management
│   ├── faxRouting.ts         # AI routing logic
│   ├── outboundFax.ts        # Sending faxes
│   └── http.ts               # Webhook handlers
├── components/               # React components
├── lib/                      # Utilities
└── README.md
```

## 🔧 Environment Variables (Prod Only)

```bash
# Convex
CONVEX_DEPLOYMENT=<your-prod-deployment>

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# HumbleFax (Platform credentials - for both sending and receiving)
HUMBLEFAX_ACCESS_KEY=...
HUMBLEFAX_SECRET_KEY=...

# Gemini AI (for OCR + routing)
GEMINI_API_KEY=...

# EmailIt (ONLY email provider - NEVER use Resend/SendGrid)
EMAILIT_API_KEY=...
```

**⚠️ EMAIL POLICY**: Use EmailIt for ALL email delivery. Never use Resend, SendGrid, or any other email provider.

## 📦 Quick Start

```bash
# Clone
git clone https://github.com/yourusername/faxbella.git
cd faxbella

# Install
npm install

# Setup Convex
npx convex init
npx convex deploy

# Run locally
npm run dev
```

## 🎨 Customer Onboarding Flow

```
[Landing Page] → [Sign Up]
                     ↓
              [Stripe Checkout]
                     ↓
               [Dashboard]
                     ↓
            [Add Recipients]
      (name, email, keywords)
                     ↓
           [Copy Webhook URL]
                     ↓
  [Paste in HumbleFax Settings]
                     ↓
                [Done! ✅]
```

## 🧠 AI Routing Algorithm (Enterprise-Grade)

FaxBella's AI engine is inspired by industry leaders like **Concord Technologies**, **eFax Clarity**, **ETHERFAX AI Insights**, **Phelix AI**, and **Medsender AI**.

### Core Capabilities

| Feature | Description | Inspired By |
|---------|-------------|-------------|
| **OCR Extraction** | Full text extraction from PDF faxes | WestFax |
| **Document Classification** | Auto-categorize as referral, prescription, invoice, lab results, etc. | Medsender AI |
| **Urgency Detection** | Flag STAT/ASAP/Emergency faxes for immediate attention | Phelix AI |
| **Structured Data Extraction** | Extract patient name, DOB, MRN, insurance, invoice #, etc. | Concord, ETHERFAX |
| **Multi-Patient Splitting** | Split faxes with multiple patients into separate records | Phelix AI, Luma Health |
| **Intelligent Routing** | Match to recipients by name, keywords, company, specialty | eFax Clarity |

### Processing Flow

```
[HumbleFax Webhook]
        ↓
[Download PDF]
        ↓
[Gemini 2.0 Flash Analysis]
        ↓
┌───────────────────────────────────────────┐
│ 1. OCR - Extract all text                 │
│ 2. Classify - referral? invoice? Rx?      │
│ 3. Urgency - STAT/ASAP detection          │
│ 4. Extract Data - patient, sender, dates  │
│ 5. Route - match to recipient             │
│ 6. Multi-Patient - split if needed        │
└───────────────────────────────────────────┘
        ↓
[Deliver via EmailIt]
  - Urgency badge (🚨 URGENT if applicable)
  - Document type label
  - Patient info display
  - Sender info
        ↓
[Webhook Delivery] (Enterprise)
  - Structured JSON payload
  - EHR/EMR integration ready
```

### Extracted Structured Data

```json
{
  "patientName": "John Smith",
  "patientDOB": "01/15/1980",
  "patientMRN": "MRN-123456",
  "senderOrganization": "ABC Medical Center",
  "senderPhone": "(555) 123-4567",
  "documentType": "referral",
  "urgency": "urgent",
  "referralType": "specialist",
  "insuranceProvider": "Blue Cross",
  "authorizationNumber": "AUTH-789"
}
```

### Urgency Detection

| Trigger | Urgency Level |
|---------|---------------|
| STAT, ASAP, Emergency, Critical, Urgent | 🚨 **URGENT** |
| Standard, Routine, FYI | Routine |
| Informational, No action required | Low |

### Document Types

- `referral` - Specialist referrals
- `prescription_refill` - Rx refill requests
- `lab_results` - Laboratory results
- `invoice` - Billing/invoices
- `prior_auth` - Prior authorization requests
- `medical_records` - Patient records
- `insurance_claim` - Insurance claims
- `appointment_request` - Scheduling requests
- `test_results` - Diagnostic test results
- `discharge_summary` - Hospital discharge
- `consultation_notes` - Physician notes

## 📊 Database Schema

```typescript
// customers - SaaS customers (businesses)
{
  email: string,
  stripeCustomerId: string,
  plan: 'starter' | 'business' | 'enterprise',
  humbleFaxKey?: string,     // Optional: customer's own credentials
  humbleFaxSecret?: string,
  webhookSecret: string,     // Unique per customer
  createdAt: number
}

// recipients - People who receive faxes
{
  customerId: Id<'customers'>,
  name: string,
  email: string,
  keywords: string[],        // Routing keywords
  company?: string,
  deliveryMethod: 'email' | 'webhook',
  webhookUrl?: string,
  createdAt: number
}

// inboundFaxes - Processed faxes (ENHANCED)
{
  customerId: Id<'customers'>,
  fromNumber: string,
  toNumber: string,
  numPages: number,
  
  // Routing
  status: 'pending' | 'routed' | 'unroutable' | 'error',
  routedToRecipientId?: Id<'recipients'>,
  routingConfidence: number,
  routingReason: string,
  extractedText?: string,
  
  // Enhanced AI Features (Competitor-Inspired)
  documentType?: string,       // referral, prescription_refill, lab_results, invoice, etc.
  urgency?: 'urgent' | 'routine' | 'low',
  urgencyReason?: string,      // Why it's marked urgent
  
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
    invoiceAmount?: string,
    insuranceProvider?: string,
    authorizationNumber?: string,
    customFields?: { key: string, value: string }[]
  },
  
  // Multi-Patient Splitting
  parentFaxId?: Id<'inboundFaxes'>,
  splitIndex?: number,
  totalSplits?: number,
  
  // Webhook Delivery
  webhookDelivered?: boolean,
  webhookDeliveredAt?: number,
  
  createdAt: number
}
```

## 🔐 Security

- All API keys stored in Convex environment variables (prod only)
- Per-customer webhook secrets for verification
- HTTPS everywhere
- No customer data in logs

## 📈 Revenue Projection

| Month | Customers | MRR |
|-------|-----------|-----|
| 1 | 10 | $290 |
| 3 | 50 | $1,450 |
| 6 | 150 | $4,350 |
| 12 | 500 | $14,500 |

## 🚀 Deployment Checklist

1. [ ] Create GitHub repo (private)
2. [ ] Deploy Convex to production
3. [ ] Configure Stripe products/prices
4. [ ] Set up Cloudflare Pages
5. [ ] Configure environment variables
6. [ ] Test end-to-end fax routing
7. [ ] Launch!

---

**FaxBella** - AI-Powered Fax Routing | [faxbella.com](https://faxbella.com)

Built with ❤️ by Doclish Inc.
