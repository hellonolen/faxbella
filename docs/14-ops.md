# FaxBella Operations

## Operational Philosophy

1. **Automation First**: Every repeatable task should be automated
2. **Self-Service Default**: Customers should solve 80% of issues themselves
3. **Fast Response**: When humans are needed, respond in <4 hours
4. **Proactive Monitoring**: Catch problems before customers report them
5. **Continuous Improvement**: Learn from every support ticket

## Customer Support

### Support Channels

| Channel | Availability | Response SLA |
|---------|-------------|--------------|
| Email (support@faxbella.com) | 24/7 | <4 hours |
| In-app chat | Business hours | <1 hour |
| Help Center | 24/7 | Self-service |
| Phone (Enterprise) | Business hours | Immediate |

### Support Tiers

| Tier | Plan | Features |
|------|------|----------|
| Standard | Starter, Business | Email, chat, help center |
| Priority | Enterprise | All above + phone, <1hr SLA |
| Dedicated | Enterprise+ | Named account manager |

### Common Support Issues

| Issue | Frequency | Resolution |
|-------|-----------|-----------|
| Fax not routing | 30% | Check recipient keywords; review AI confidence |
| Email not received | 20% | Check spam; verify email address |
| Setup questions | 20% | Point to documentation; offer call |
| Billing questions | 15% | Stripe dashboard; issue credits |
| Feature requests | 10% | Log in roadmap; thank customer |
| Bug reports | 5% | Escalate to engineering |

### Support Runbook

#### Fax Not Routing Correctly

1. **Check inbound fax record**: Is it in the system?
2. **Check AI confidence**: Was it low? Why?
3. **Check recipient keywords**: Do they match content?
4. **Check unroutable queue**: Is it waiting for manual action?
5. **Resolution**: Adjust keywords, route manually, or escalate

#### Customer Can't Access Dashboard

1. **Verify account exists**: Check by email in Convex
2. **Check subscription status**: Is it active in Stripe?
3. **Try password reset**: Send reset link
4. **Check browser issues**: Cookies, cache clearing
5. **Escalate**: If technical issue persists

### Escalation Path

| Level | Who | When |
|-------|-----|------|
| L1 | Support agent | First response |
| L2 | Senior support | Complex issues, angry customers |
| L3 | Engineering | Bug fixes, technical escalations |
| L4 | Founder | Legal, security, major incidents |

## Customer Onboarding

### Automated Onboarding Sequence

| Day | Email | Content |
|-----|-------|---------|
| 0 | Welcome | Account confirmation, get started link |
| 1 | Setup Guide | Step-by-step webhook configuration |
| 3 | Check-in | "Have you routed your first fax?" |
| 7 | Tips | Best practices for keywords, accuracy |
| 10 | Feedback | NPS survey |
| 14 | Trial Ending | Upgrade reminder with ROI |

### Onboarding Milestones

| Milestone | Target % | Action if Not Met |
|-----------|---------|-------------------|
| Account created | 100% | - |
| First recipient added | 80% (Day 1) | Automated reminder |
| Webhook configured | 70% (Day 2) | Email + offer call |
| First fax routed | 60% (Day 3) | Personal outreach |
| 5+ faxes routed | 50% (Day 7) | Check for issues |

## Billing Operations

### Billing Events

| Event | Action |
|-------|--------|
| Trial started | No charge |
| Trial → Paid | Charge first month |
| Monthly renewal | Auto-charge |
| Payment failed | Retry 3x, then pause |
| Subscription canceled | Access until period end |
| Refund requested | Evaluate, process if valid |

### Refund Policy

| Scenario | Policy |
|----------|--------|
| Charged by mistake | Full refund |
| Didn't use service | Pro-rata if <7 days |
| Service issues | Case-by-case |
| "Changed my mind" | No refund (monthly) |
| Annual prepay cancellation | Pro-rata remaining months |

### Dunning Process

| Day | Action |
|-----|--------|
| 0 | Payment failed - auto retry |
| 1 | Email: "Payment failed, please update" |
| 3 | Second retry |
| 3 | Email: "Still having trouble" |
| 7 | Third retry |
| 7 | Email: "Your access will be paused" |
| 10 | Pause account |
| 30 | Cancel subscription |

## Infrastructure Operations

### Monitoring

| System | Tool | Alert Threshold |
|--------|------|-----------------|
| Convex functions | Convex dashboard | Error rate >1% |
| Cloudflare Pages | Cloudflare analytics | 5xx errors |
| Gemini API | Custom logging | Response time >15s |
| HumbleFax webhook | Custom logging | Failures >5/hour |
| Email delivery | EmailIt dashboard | Bounce rate >5% |

### Incident Response

| Severity | Definition | Response Time |
|----------|-----------|---------------|
| P1 | Service down | Immediate |
| P2 | Major feature broken | <1 hour |
| P3 | Minor issue | <4 hours |
| P4 | Cosmetic | Next business day |

### Incident Runbook

1. **Detect**: Monitoring alert or customer report
2. **Acknowledge**: Post in #incidents Slack
3. **Diagnose**: Check logs, identify root cause
4. **Mitigate**: Apply temporary fix if possible
5. **Communicate**: Update status page, notify affected customers
6. **Resolve**: Deploy permanent fix
7. **Post-mortem**: Write incident report, prevent recurrence

### Status Page (statuspage.faxbella.com)

| Component | Monitoring |
|-----------|-----------|
| Dashboard | Synthetic checks every 5 min |
| Fax Routing | Webhook success rate |
| Email Delivery | EmailIt API status |
| AI Processing | Gemini API status |

## Data Operations

### Backup Strategy

| Data | Frequency | Retention |
|------|-----------|-----------|
| Convex database | Continuous (built-in) | 30 days |
| PDF files | Continuous (R2) | 1 year |
| Audit logs | Daily | 7 years |

### Data Retention

| Data Type | Retention | Deletion Process |
|-----------|-----------|-----------------|
| Fax PDFs | 1 year | Auto-purge |
| Extracted text | 1 year | Auto-purge |
| Customer data | Until deletion request | 30-day grace |
| Audit logs | 7 years | Auto-archive |

### Customer Data Requests

| Request Type | SLA | Process |
|-------------|-----|---------|
| Data export | 7 days | Generate JSON/CSV, send securely |
| Data deletion | 30 days | Verify identity, delete, confirm |
| Access request | 7 days | Generate report, send securely |

## Vendor Management

### Critical Vendors

| Vendor | Purpose | Backup Plan |
|--------|---------|-------------|
| Convex | Backend, database | No direct backup (critical dependency) |
| Cloudflare | Hosting, CDN | Can migrate to Vercel |
| HumbleFax | Fax infrastructure | Evaluate alternatives |
| Google (Gemini) | AI/OCR | OpenAI GPT-4V fallback |
| Stripe | Payments | Critical, no backup |
| EmailIt | Email delivery | SendGrid fallback |

### Vendor Health Checks

- Monthly review of vendor status pages
- Quarterly review of pricing/terms
- Annual security assessment

## Capacity Planning

### Current Limits

| Resource | Limit | Current Usage |
|----------|-------|---------------|
| Convex functions | 1M/month | - |
| Convex storage | 1GB | - |
| Gemini API | 60 req/min | - |
| HumbleFax | Based on plan | - |

### Scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| Faxes/day | 5,000 | Evaluate queue optimization |
| API latency | >500ms P95 | Add caching |
| Storage | 80% capacity | Increase limit |
| Support tickets | 50/day | Add support agent |

---

*Smooth operations are invisible. That's the goal.*
