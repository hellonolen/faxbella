# FaxBella Features

## Feature Matrix by Plan

| Feature | Starter ($29) | Business ($99) | Enterprise ($299) |
|---------|:-------------:|:--------------:|:-----------------:|
| Faxes/month | 100 | 500 | Unlimited |
| Recipients | 5 | 25 | Unlimited |
| AI Routing | ✅ | ✅ | ✅ |
| Email Delivery | ✅ | ✅ | ✅ |
| Document Classification | ✅ | ✅ | ✅ |
| Urgency Detection | ✅ | ✅ | ✅ |
| Structured Data Extraction | ❌ | ✅ | ✅ |
| Webhook Delivery | ❌ | ✅ | ✅ |
| API Access | ❌ | ✅ | ✅ |
| Outbound Fax | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ✅ |
| SSO/SAML | ❌ | ❌ | ✅ |
| Dedicated Support | ❌ | ❌ | ✅ |
| SLA | 99.9% | 99.9% | 99.99% |

---

## Core Features (All Plans)

### 1. AI-Powered Fax Routing

**What it does:**
Automatically reads incoming fax content and routes to the correct recipient.

**How it works:**
- Receives fax PDF via HumbleFax webhook
- Gemini 2.0 Flash extracts text (OCR)
- AI identifies recipient signals:
  - "ATTN:", "To:", "Dear Dr."
  - Account/reference numbers
  - Company names
  - Keywords in routing rules
- Matches to registered recipients
- Delivers via email or webhook

**Accuracy:** 95%+ on well-formatted faxes

**Speed:** <30 seconds end-to-end

---

### 2. Document Classification

**What it does:**
Automatically categorizes fax type for filtering and prioritization.

**Document Types Detected:**
| Type | Description |
|------|-------------|
| `referral` | Patient referrals to specialists |
| `prescription_refill` | Rx refill requests |
| `lab_results` | Laboratory test results |
| `medical_records` | Patient health records |
| `prior_auth` | Prior authorization requests |
| `insurance_claim` | Insurance claims/EOBs |
| `invoice` | Bills and invoices |
| `appointment_request` | Scheduling requests |
| `test_results` | Diagnostic imaging, other tests |
| `discharge_summary` | Hospital discharge docs |
| `consultation_notes` | Physician notes |
| `other` | Unclassified documents |

---

### 3. Urgency Detection

**What it does:**
Flags time-sensitive faxes so recipients prioritize them.

**Urgency Levels:**
| Level | Triggers | Visual |
|-------|----------|--------|
| 🚨 **Urgent** | STAT, ASAP, Emergency, Critical, Urgent | Red badge, red email header |
| 📋 **Routine** | Normal processing | Blue badge |
| ℹ️ **Low** | FYI, Informational | Gray badge |

**Email Display:**
- Urgent faxes have red header
- Urgency reason displayed: "STAT referral - requires immediate attention"
- Subject line includes 🚨 emoji

---

### 4. Email Delivery

**What it does:**
Delivers faxes to recipient's email inbox with rich formatting.

**Email Includes:**
- FaxBella branding
- Urgency badge
- Document type label
- Sender fax number
- Patient info (if extracted)
- Sender organization (if extracted)
- Routing confidence %
- Routing reason
- PDF attachment
- "View in Dashboard" link

**Sender:** `fax@faxbella.com` (DKIM/SPF verified)

---

### 5. Dashboard

**What it does:**
Web interface for managing faxes and recipients.

**For Account Admins:**
- View all routed faxes
- Handle unroutable queue
- Manage recipients
- View analytics
- Configure settings

**For Recipients:**
- Personal fax inbox
- Filter by type, urgency, date
- Search fax content
- Download PDFs
- Mark as read/archived

---

### 6. Recipient Management

**What it does:**
Add and configure team members who receive faxes.

**Recipient Fields:**
- Name
- Email
- Keywords (routing hints)
- Department
- Company (for multi-tenant)
- Delivery method (email/webhook)
- Webhook URL (if applicable)

---

## Business Plan Features

### 7. Structured Data Extraction

**What it does:**
Extracts specific data fields from fax content into structured JSON.

**Extracted Fields:**
```json
{
  "patientName": "John Smith",
  "patientDOB": "01/15/1980",
  "patientMRN": "MRN-123456",
  "patientPhone": "(555) 123-4567",
  "senderName": "Dr. Jane Doe",
  "senderOrganization": "ABC Medical Center",
  "senderPhone": "(555) 987-6543",
  "senderFax": "(555) 987-6544",
  "documentType": "referral",
  "referralType": "specialist",
  "insuranceProvider": "Blue Cross",
  "authorizationNumber": "AUTH-789",
  "dateOfService": "01/20/2026",
  "urgency": "urgent",
  "urgencyReason": "STAT referral"
}
```

**Use Cases:**
- Pre-populate EMR fields
- Trigger automated workflows
- Build custom dashboards

---

### 8. Webhook Delivery

**What it does:**
Delivers fax data to custom endpoints for integration.

**Webhook Payload:**
```json
{
  "event": "fax.routed",
  "faxId": "abc123",
  "fromNumber": "+15551234567",
  "recipient": {
    "id": "rec_xyz",
    "email": "dr.smith@clinic.com",
    "name": "Dr. Smith"
  },
  "documentType": "referral",
  "urgency": "urgent",
  "structuredData": { ... },
  "confidence": 0.95,
  "pdfUrl": "https://api.faxbella.com/fax/abc123/download"
}
```

**Security:**
- HMAC signature verification
- Customer-specific webhook secret
- Retry with exponential backoff

---

### 9. API Access

**What it does:**
Programmatic access to FaxBella functionality.

**Endpoints:**
| Endpoint | Description |
|----------|-------------|
| `GET /faxes` | List faxes with filters |
| `GET /faxes/:id` | Get fax details |
| `GET /faxes/:id/download` | Download PDF |
| `GET /recipients` | List recipients |
| `POST /recipients` | Add recipient |
| `PATCH /recipients/:id` | Update recipient |
| `DELETE /recipients/:id` | Remove recipient |
| `POST /fax/send` | Send outbound fax |

**Authentication:** API key in header
**Rate Limits:** 1000 req/min (Enterprise: 5000)

---

### 10. Outbound Fax

**What it does:**
Send faxes from the dashboard or via API.

**Features:**
- Upload PDF or enter text
- Recipient fax number
- Cover page options
- Delivery confirmation
- Retry on failure

**Pricing:** Included in fax allotment

---

## Enterprise Plan Features

### 11. Custom Branding

**What it does:**
White-label email notifications and dashboard.

**Customizable:**
- Logo in emails
- Brand colors
- Custom sender name
- Custom dashboard domain (CNAME)

---

### 12. SSO/SAML

**What it does:**
Enterprise single sign-on integration.

**Supported:**
- Okta
- Azure AD
- Google Workspace
- OneLogin
- Generic SAML 2.0

---

### 13. Multi-Patient Splitting

**What it does:**
Automatically splits faxes containing multiple patients into separate records.

**How it works:**
- AI detects multiple patient records in single fax
- Creates separate routing entries for each
- Links to parent fax for audit

---

### 14. Dedicated Support

**What it does:**
Priority support channel for Enterprise customers.

**Includes:**
- Dedicated account manager
- 1-hour response SLA
- Implementation assistance
- Quarterly business reviews

---

## Roadmap Features (Coming Soon)

| Feature | Target | Description |
|---------|--------|-------------|
| EHR Integrations | Q2 2026 | Epic, Athena, eClinicalWorks |
| Slack/Teams Notifications | Q2 2026 | Deliver to chat channels |
| Mobile App | Q3 2026 | iOS/Android fax viewer |
| Custom AI Training | Q4 2026 | Fine-tune on customer fax patterns |
| Multi-Location | Q4 2026 | Separate routing per office |

---

*FaxBella: Every feature designed for one goal—faxes find their person, instantly.*
