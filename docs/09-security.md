# FaxBella Security & Compliance

## Security Overview

FaxBella is designed for healthcare organizations that require HIPAA-compliant document handling. Security is not an afterthought—it's built into every layer.

## HIPAA Compliance

### What is HIPAA?

The Health Insurance Portability and Accountability Act (HIPAA) sets standards for protecting sensitive patient health information (PHI). Key requirements:

- **Privacy Rule**: Limits use and disclosure of PHI
- **Security Rule**: Technical safeguards for electronic PHI
- **Breach Notification Rule**: Reporting requirements for data breaches

### How FaxBella Complies

| Requirement | How We Meet It |
|-------------|---------------|
| **Access Controls** | Role-based access; customers only see their data |
| **Audit Trails** | All fax events logged with timestamps |
| **Encryption in Transit** | TLS 1.3 for all connections |
| **Encryption at Rest** | Convex storage encryption; Cloudflare SSL |
| **Data Minimization** | AI processes content but doesn't store PHI long-term |
| **Business Associate Agreement** | BAA available for all paid plans |

### Business Associate Agreement (BAA)

As a business associate handling PHI on behalf of covered entities (healthcare providers), we offer:

- **Standard BAA**: Included with Business and Enterprise plans
- **Custom BAA**: Available for Enterprise with legal review
- **Subcontractor BAAs**: We maintain BAAs with our vendors (Convex, Cloudflare)

## Data Flow Security

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURE DATA FLOW                              │
└─────────────────────────────────────────────────────────────────┘

[Sender's Fax] ──TLS──▶ [HumbleFax] ──TLS──▶ [FaxBella Convex]
                                                    │
                                              Encrypted Storage
                                              (Convex + R2)
                                                    │
                              TLS ◀─────────────────┴──────▶ TLS
                               │                              │
                        [EmailIt]                    [Dashboard]
                               │                              │
                        TLS    ▼                              ▼
                    [Recipient Email]              [Recipient Browser]
```

### Encryption Standards

| Location | Encryption |
|----------|-----------|
| In Transit | TLS 1.3 |
| At Rest (Convex) | AES-256 |
| At Rest (R2) | AES-256 |
| PDF Storage | Encrypted blob storage |
| Database | Convex managed encryption |

## Authentication & Access Control

### User Authentication

- **Email/Password**: Salted, hashed passwords (bcrypt)
- **Session Management**: Secure, HTTP-only cookies
- **Session Expiry**: 7-day sliding window
- **Password Requirements**: 8+ characters, complexity enforced

### Enterprise Authentication

- **SSO/SAML**: Okta, Azure AD, Google Workspace
- **MFA**: Supported via SSO provider
- **Role-Based Access**: Admin, Manager, Recipient roles

### API Authentication

- **API Keys**: Per-customer, revocable
- **Webhook Verification**: HMAC-SHA256 signatures
- **Rate Limiting**: 1000 requests/minute (Enterprise: 5000)

## AI Processing Security

### How Gemini Processes Faxes

1. **Temporary Processing**: PDF sent to Gemini via API
2. **No Training**: Google does not train on Gemini API inputs
3. **Delete After Processing**: Google deletes inputs after response
4. **No PHI Storage**: FaxBella stores extracted fields, not raw PHI

### Structured Data Extraction

We extract and store:
- Patient name (for routing display)
- DOB (for identification)
- Sender organization
- Document type/urgency

We **do NOT** store:
- Full medical records content
- Social Security Numbers
- Complete clinical notes
- Insurance policy details beyond name

## Vendor Security

### Convex
- SOC 2 Type II certified
- HIPAA-compliant infrastructure
- Signed BAA available

### Cloudflare
- SOC 2 Type II, ISO 27001, PCI DSS
- HIPAA BAA available
- Global edge security

### HumbleFax
- HIPAA-compliant fax provider
- BAA included
- SOC 2 compliant

### EmailIt
- TLS encryption
- HIPAA-aware email delivery
- No PHI in email body (summary only)

## Incident Response

### Breach Detection

- Automated monitoring for anomalies
- Login attempt tracking
- API abuse detection
- Real-time alerting

### Breach Response Plan

| Phase | Action | Timeline |
|-------|--------|----------|
| **Detection** | Identify and contain | Immediate |
| **Assessment** | Determine scope and impact | 24 hours |
| **Notification** | Notify affected customers | 48 hours |
| **Regulators** | HHS notification if required | 60 days |
| **Remediation** | Fix vulnerability, update controls | Ongoing |

### Contact for Security Issues

- **Security Email**: security@faxbella.com
- **Responsible Disclosure**: We welcome security researchers
- **Bug Bounty**: Coming soon

## Compliance Certifications (Roadmap)

| Certification | Status | Target |
|---------------|--------|--------|
| HIPAA Compliance | ✅ Compliant | Now |
| BAA Available | ✅ Yes | Now |
| SOC 2 Type I | 🔄 In Progress | Q3 2026 |
| SOC 2 Type II | 📅 Planned | Q1 2027 |
| HITRUST | 📅 Planned | 2027 |

## Data Retention

| Data Type | Retention | Reason |
|-----------|-----------|--------|
| Fax PDFs | 1 year | Customer access |
| Extracted Text | 1 year | Search/audit |
| Audit Logs | 7 years | HIPAA requirement |
| Account Data | Until deletion + 30 days | Recovery window |

### Data Deletion

- **Customer Request**: Delete all data within 30 days
- **Account Closure**: Data deleted after 30-day grace period
- **Automatic**: Expired data purged per retention policy

## Security Best Practices

### For Customers

1. **Use Strong Passwords**: Unique, 12+ characters
2. **Enable SSO**: Use enterprise identity provider
3. **Limit Recipients**: Only add necessary team members
4. **Review Audit Logs**: Monitor for anomalies
5. **Update Webhook Secrets**: Rotate periodically

### For FaxBella Team

1. **Least Privilege**: Minimal access for all team members
2. **Code Review**: All changes reviewed before deploy
3. **Dependency Scanning**: Automated vulnerability detection
4. **Security Training**: Annual HIPAA/security training
5. **Penetration Testing**: Annual third-party assessment

---

*Security is not a feature. It's the foundation.*
