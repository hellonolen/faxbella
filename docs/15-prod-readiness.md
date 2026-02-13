# FaxBella Production Readiness

## Production Checklist

### ✅ Core Product

| Item | Status | Notes |
|------|--------|-------|
| AI routing engine | ✅ Complete | Gemini 2.0 Flash integrated |
| Document classification | ✅ Complete | 12 document types |
| Urgency detection | ✅ Complete | urgent/routine/low |
| Structured data extraction | ✅ Complete | Patient, sender, insurance |
| Email notifications | ✅ Complete | Branded, urgency badges |
| Webhook receiver | ✅ Complete | HumbleFax integration |
| PDF storage | ✅ Complete | Convex storage |

### ✅ Database Schema

| Item | Status | Notes |
|------|--------|-------|
| customers table | ✅ Complete | Multi-tenant ready |
| recipients table | ✅ Complete | Keywords, delivery method |
| inboundFaxes table | ✅ Complete | Enhanced with AI fields |
| Indexes | ✅ Complete | by_urgency, by_documentType, etc. |

### 🔄 Frontend

| Item | Status | Notes |
|------|--------|-------|
| Landing page | 🔄 Needed | Design → implement |
| Pricing page | 🔄 Needed | Tier comparison |
| Dashboard - Inbox | 🔄 Needed | List/view faxes |
| Dashboard - Recipients | 🔄 Needed | Manage team |
| Dashboard - Settings | 🔄 Needed | Account config |
| Authentication | 🔄 Needed | Clerk or custom |
| Stripe checkout | 🔄 Needed | Payment flow |

### 🔄 Operations

| Item | Status | Notes |
|------|--------|-------|
| Error monitoring | 🔄 Needed | Sentry or similar |
| Uptime monitoring | 🔄 Needed | Status page |
| Log aggregation | 🔄 Needed | Structured logging |
| Alerting | 🔄 Needed | PagerDuty/Slack |

### 🔄 Compliance

| Item | Status | Notes |
|------|--------|-------|
| Terms of Service | 🔄 Needed | Legal draft |
| Privacy Policy | 🔄 Needed | Legal draft |
| BAA template | 🔄 Needed | Legal draft |
| Cookie consent | 🔄 Needed | Banner |

## Production Environment

### Convex

**Deployment**: `npx convex deploy`

**Environment Variables Required:**
```bash
HUMBLEFAX_ACCESS_KEY=xxx
HUMBLEFAX_SECRET_KEY=xxx
GEMINI_API_KEY=xxx
EMAILIT_API_KEY=xxx
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
```

### Cloudflare

**Domain**: faxbella.com (to be configured)

**Deployment**:
```bash
npm run build
npx wrangler deploy
```

## API Endpoints

### HTTP Routes (Convex)

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/inbound-fax` | POST | HumbleFax webhook | ✅ Ready |
| `/stripe-webhook` | POST | Stripe events | 🔄 Needed |

## Testing Status

### Unit Tests

| Area | Coverage | Status |
|------|----------|--------|
| Routing logic | - | 🔄 Needed |
| Schema validation | - | 🔄 Needed |
| Mutations | - | 🔄 Needed |

### Integration Tests

| Flow | Status |
|------|--------|
| Fax → Route → Email | ✅ Manual tested |
| Signup → Trial → Convert | 🔄 Needed |
| Add recipient → Keywords → Match | 🔄 Needed |

### Load Testing

| Scenario | Target | Status |
|----------|--------|--------|
| 100 faxes/hour | 30s routing | 🔄 Needed |
| 1000 faxes/hour | 30s routing | 🔄 Needed |
| 50 concurrent users | <1s dashboard load | 🔄 Needed |

## Security Checklist

| Item | Status | Notes |
|------|--------|-------|
| TLS everywhere | ✅ | Cloudflare SSL |
| Secrets in env vars | ✅ | Not in code |
| Input validation | ✅ | Convex validators |
| Rate limiting | 🔄 Needed | API protection |
| CORS configuration | 🔄 Needed | Dashboard only |
| Webhook verification | ✅ | HMAC signatures |
| Password hashing | 🔄 Needed | If using custom auth |
| Session management | 🔄 Needed | Secure cookies |

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Webhook response | <200ms | ✅ |
| Fax-to-email | <30s | ✅ |
| Dashboard load | <1s | n/a |
| API response | <100ms | n/a |

## Launch Blockers

### Must Have (P0)

| Item | Owner | ETA |
|------|-------|-----|
| Frontend dashboard | - | - |
| Stripe integration | - | - |
| User authentication | - | - |
| Landing page | - | - |

### Should Have (P1)

| Item | Owner | ETA |
|------|-------|-----|
| Help center | - | - |
| Onboarding emails | - | - |
| Error monitoring | - | - |
| Status page | - | - |

### Nice to Have (P2)

| Item | Owner | ETA |
|------|-------|-----|
| Demo video | - | - |
| Case studies | - | - |
| Referral program | - | - |
| API documentation | - | - |

## Rollback Plan

### If Core Routing Fails

1. Disable webhook (HumbleFax dashboard)
2. Investigate in Convex logs
3. Deploy fix or revert
4. Re-enable webhook
5. Check for missed faxes

### If Database Issues

1. Convex has automatic backups
2. Contact Convex support for recovery
3. Communicate with customers

### If Vendor Outage

| Vendor | Impact | Action |
|--------|--------|--------|
| Convex | Full outage | Wait, communicate |
| Gemini | No routing | Queue faxes, wait |
| EmailIt | No notifications | Switch to backup |
| HumbleFax | No fax receipt | Customer awareness |

## Go-Live Checklist

### 24 Hours Before

- [ ] Final code review
- [ ] All secrets rotated
- [ ] Monitoring verified
- [ ] Backup verified
- [ ] Team on standby

### Launch Hour

- [ ] Deploy to production
- [ ] Verify all endpoints
- [ ] Send test fax
- [ ] Verify email delivery
- [ ] Enable public access

### Post-Launch (Hour 1-4)

- [ ] Monitor error rates
- [ ] Respond to first signups
- [ ] Fix any critical issues
- [ ] Document issues encountered

### Post-Launch (Day 1)

- [ ] Review all metrics
- [ ] Triage support tickets
- [ ] Team debrief
- [ ] Plan Week 1 priorities

---

## Summary: What's Ready Now

| Component | Production Ready |
|-----------|------------------|
| AI Routing Engine | ✅ YES |
| Database Schema | ✅ YES |
| Email Notifications | ✅ YES |
| Webhook Receiver | ✅ YES |
| Frontend Dashboard | ❌ NOT YET |
| Stripe Billing | ❌ NOT YET |
| User Auth | ❌ NOT YET |
| Legal Documents | ❌ NOT YET |

**Backend is production-ready. Frontend and billing needed for launch.**

---

*Ship when the core is solid. Iterate on the rest.*
