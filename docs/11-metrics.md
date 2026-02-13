# FaxBella Metrics & KPIs

## North Star Metric

**Faxes Routed Per Month**

This single metric captures:
- Customer value (more faxes = more time saved)
- Product health (routing accuracy enables volume)
- Business growth (more customers = more faxes)

## Metric Framework

### Input Metrics (Leading)
Things we control that drive outcomes

### Output Metrics (Lagging)
Business results we're trying to achieve

```
┌─────────────────────────────────────────────────────────────────────┐
│                        METRICS FUNNEL                               │
└─────────────────────────────────────────────────────────────────────┘

  INPUT METRICS                              OUTPUT METRICS
  ──────────────                             ──────────────
  
  Website Traffic ────────────────────────▶ Signups
  Trial Starts ───────────────────────────▶ Trial Conversions
  Onboarding Completion ──────────────────▶ First Fax Routed
  Routing Accuracy ───────────────────────▶ Customer Satisfaction
  Support Response Time ──────────────────▶ Churn Rate
  Feature Usage ──────────────────────────▶ Expansion Revenue
```

## Key Performance Indicators

### Acquisition Metrics

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| Website Visitors | Unique visitors/month | 10,000 | - |
| Visitor → Trial | % starting trial | 5% | - |
| Trial Starts | New trials/month | 500 | - |
| Trial → Paid | % converting to paid | 25% | - |
| CAC | Cost to acquire customer | <$150 | - |
| Payback Period | Months to recover CAC | <3 | - |

### Activation Metrics

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| Time to First Recipient | Minutes to add first user | <5 | - |
| Time to First Fax | Minutes to first routed fax | <30 | - |
| Onboarding Completion | % completing setup | 80% | - |
| Week 1 Retention | % active after 7 days | 70% | - |

### Engagement Metrics

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| Daily Active Faxes | Faxes routed/day (avg) | - | - |
| Faxes Per Customer | Monthly faxes per account | 100+ | - |
| Recipients Per Account | Avg recipients configured | 8 | - |
| Dashboard DAU | Daily active users | 50% of accounts | - |
| Routing Accuracy | % correctly routed | 95% | - |
| Unroutable Rate | % needing manual routing | <5% | - |

### Revenue Metrics

| Metric | Definition | Target Y1 | Current |
|--------|------------|-----------|---------|
| MRR | Monthly Recurring Revenue | $50,000 | - |
| ARR | Annual Recurring Revenue | $600,000 | - |
| ARPU | Average Revenue Per User | $80/mo | - |
| LTV | Lifetime Value | $2,000 | - |
| LTV:CAC | Ratio | >3:1 | - |
| Net Revenue Retention | Including expansion | 110% | - |

### Retention Metrics

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| Monthly Churn | % accounts churning | <3% | - |
| Annual Retention | % retained after 12 months | >70% | - |
| NPS | Net Promoter Score | 50+ | - |
| CSAT | Customer Satisfaction | 4.5/5 | - |

## Product Health Metrics

### AI Performance

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| Routing Accuracy | Correct recipient | 95% | - |
| Classification Accuracy | Correct doc type | 90% | - |
| Urgency Detection | Correct urgency | 85% | - |
| Processing Time | Fax received → routed | <30s | - |
| OCR Quality | Text extraction accuracy | 98% | - |

### System Health

| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| Uptime | Service availability | 99.9% | - |
| Webhook Latency | Response time | <200ms | - |
| Email Delivery | Successful delivery | 99.5% | - |
| Error Rate | Failed fax processing | <1% | - |
| API Latency | P95 response time | <100ms | - |

## Dashboard Views

### Executive Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  FAXBELLA EXECUTIVE DASHBOARD                    Feb 2026          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   $45,000   │  │    520      │  │    2.8%     │  │    95.2%    ││
│  │     MRR     │  │  Customers  │  │    Churn    │  │  Accuracy   ││
│  │   +12% ▲    │  │   +8% ▲     │  │   -0.3% ▼   │  │   +0.5% ▲   ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │     MRR GROWTH                                                  ││
│  │  $50K ┤                                            ╭────        ││
│  │       │                                       ╭────╯            ││
│  │  $40K ┤                                  ╭────╯                 ││
│  │       │                             ╭────╯                      ││
│  │  $30K ┤                        ╭────╯                           ││
│  │       │                   ╭────╯                                ││
│  │  $20K ┤              ╭────╯                                     ││
│  │       │         ╭────╯                                          ││
│  │  $10K ┤    ╭────╯                                               ││
│  │       │────╯                                                    ││
│  │    $0 ┼────────────────────────────────────────────────────     ││
│  │       Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov Dec ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐  │
│  │  FAXES THIS MONTH           │  │  CUSTOMER BREAKDOWN         │  │
│  │                             │  │                             │  │
│  │  52,340 total               │  │  Starter:    210 (40%)     │  │
│  │  ████████████████████       │  │  Business:   260 (50%)     │  │
│  │                             │  │  Enterprise:  50 (10%)     │  │
│  └─────────────────────────────┘  └─────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Operations Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  OPERATIONS                                      Last 24 Hours      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  System Status: ● ALL SYSTEMS OPERATIONAL                          │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   1,847     │  │    23.4s    │  │   99.94%    │  │   4.2%      ││
│  │ Faxes Today │  │  Avg Route  │  │   Uptime    │  │ Unroutable  ││
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘│
│                                                                     │
│  Error Log (Last 10):                                              │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 14:32 | customer_xyz | PDF download failed - retrying          ││
│  │ 14:28 | customer_abc | Gemini timeout - retrying               ││
│  │ 13:45 | customer_def | Webhook delivery failed - queued        ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Metric Targets by Quarter

### Q1 2026 (Launch)

| Metric | Target |
|--------|--------|
| Customers | 50 |
| MRR | $5,000 |
| Routing Accuracy | 90% |
| Uptime | 99.5% |

### Q2 2026

| Metric | Target |
|--------|--------|
| Customers | 200 |
| MRR | $20,000 |
| Routing Accuracy | 93% |
| Uptime | 99.9% |

### Q3 2026

| Metric | Target |
|--------|--------|
| Customers | 400 |
| MRR | $40,000 |
| Routing Accuracy | 95% |
| NPS | 40 |

### Q4 2026

| Metric | Target |
|--------|--------|
| Customers | 600 |
| MRR | $60,000 |
| Annual Retention | 70% |
| NPS | 50 |

## Data Collection

### Event Tracking

| Event | Properties |
|-------|-----------|
| `signup_started` | source, plan |
| `signup_completed` | plan, trial |
| `recipient_added` | count |
| `fax_received` | customer_id, pages |
| `fax_routed` | confidence, doc_type, urgency |
| `fax_unroutable` | reason |
| `dashboard_viewed` | page |
| `subscription_started` | plan, mrr |
| `subscription_churned` | reason, mrr_lost |

### Tools

| Tool | Purpose |
|------|---------|
| Convex Analytics | Product events |
| Stripe Dashboard | Revenue metrics |
| Cloudflare Analytics | Web traffic |
| (Future) Posthog | Product analytics |

---

*Measure what matters. Improve what you measure.*
