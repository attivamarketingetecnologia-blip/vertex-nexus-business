# API Monitoring Sales Pipeline Template

## Pipeline Stages & Definitions

### Stage 1: Lead Capture (0-30 points)
**Status:** New Contact
**Goal:** Move to nurturing
**Actions:**
- Automated welcome sequence
- Lead scoring begins
- Initial qualification

**Entry Criteria:**
- Form submission
- Trial signup
- Event registration

**Exit Criteria:**
- Lead score > 30
- Engagement detected
- 3+ days since capture

### Stage 2: Nurturing (31-60 points)
**Status:** Marketing Qualified Lead (MQL)
**Goal:** Move to qualification
**Actions:**
- Educational content delivery
- Product tour invitations
- Case study sharing

**Entry Criteria:**
- Lead score 31-60
- Engaged with content
- Not sales-ready

**Exit Criteria:**
- Lead score > 60
- Requested demo
- Sales outreach accepted

### Stage 3: Qualification (61-80 points)
**Status:** Sales Qualified Lead (SQL)
**Goal:** Move to proposal
**Actions:**
- Discovery call
- Needs assessment
- Solution presentation

**Entry Criteria:**
- Lead score 61-80
- Agreed to sales call
- Budget/authority confirmed

**Exit Criteria:**
- Solution fit confirmed
- Proposal requested
- Decision timeline established

### Stage 4: Proposal (81-90 points)
**Status:** Opportunity
**Goal:** Move to closing
**Actions:**
- Proposal delivery
- Custom demo (if needed)
- Implementation planning

**Entry Criteria:**
- Solution fit confirmed
- Proposal requested
- Decision maker identified

**Exit Criteria:**
- Proposal accepted
- Contract sent
- Technical questions resolved

### Stage 5: Closing (91-100 points)
**Status:** Closing
**Goal:** Customer won
**Actions:**
- Contract signing
- Payment processing
- Onboarding kickoff

**Entry Criteria:**
- Proposal accepted
- Contract in review
- Implementation ready

**Exit Criteria:**
- Contract signed
- Payment received
- Onboarding started

---

## Lead Scoring Model

### Demographic Scoring (Max 30)

**Team Size:**
- 1-5 developers: +10
- 6-10 developers: +20
- 11+ developers: +30

**Industry:**
- SaaS/Technology: +25
- E-commerce: +20
- Finance: +15
- Healthcare: +10
- Other: +5

**Tech Stack:**
- Modern (Node.js, Python, Go): +20
- Mixed: +10
- Legacy: +5

**Company Size:**
- Startup (< 10 employees): +15
- Small Business (10-50): +20
- Medium Business (51-200): +25
- Enterprise (200+): +30

### Behavioral Scoring (Max 40)

**Website Activity:**
- Visited pricing page: +10
- Viewed case studies: +15
- Read 3+ blog posts: +20
- Downloaded resource: +15

**Product Engagement:**
- Started free trial: +20
- Created first monitor: +25
- Set up alerts: +30
- Invited team member: +25
- Used API integration: +35

**Content Consumption:**
- Watched tutorial video: +15
- Attended webinar: +25
- Downloaded checklist: +10
- Read documentation: +20

### Engagement Scoring (Max 30)

**Email Engagement:**
- Opened 3+ emails: +10
- Clicked links in emails: +15
- Replied to email: +20
- Unsubscribed: -30

**Social Engagement:**
- Followed on Twitter: +10
- Joined community: +15
- Shared content: +20
- Mentioned product: +25

**Sales Engagement:**
- Responded to outreach: +20
- Scheduled call: +25
- Attended demo: +30
- Asked pricing questions: +25

### Negative Scoring (Subtract)

**Inactivity:**
- No activity for 30 days: -10
- No activity for 60 days: -20
- No activity for 90 days: -30

**Disqualification:**
- Wrong industry: -40
- No budget: -30
- No authority: -25
- Wrong use case: -35

---

## Sales Process Timeline

### Day 1-2: Initial Contact
**Actions:**
- Welcome email (immediate)
- Lead scoring begins
- Initial qualification check

**Success Metrics:**
- Email open rate: > 40%
- Website revisit: > 20%

### Day 3-7: Nurturing Phase
**Actions:**
- Educational email sequence (3 emails)
- Product tour invitation
- Case study delivery

**Success Metrics:**
- Email click rate: > 15%
- Feature exploration: > 30%

### Day 8-14: Engagement Building
**Actions:**
- Personalized outreach
- Demo invitation
- Needs assessment call

**Success Metrics:**
- Response rate: > 20%
- Demo scheduling: > 10%

### Day 15-21: Solution Presentation
**Actions:**
- Discovery call (30 min)
- Custom demo (if needed)
- Solution proposal

**Success Metrics:**
- Proposal acceptance: > 60%
- Technical fit confirmed: > 80%

### Day 22-30: Closing Phase
**Actions:**
- Contract negotiation
- Implementation planning
- Onboarding setup

**Success Metrics:**
- Close rate: > 40%
- Time to close: < 30 days

---

## Sales Tools & Templates

### Email Templates

**Welcome Email:**
```
Subject: Welcome to API Monitoring!

Hi [Name],

Thanks for signing up for [Product Name]! We're excited to help you monitor your APIs with ease.

To get started:
1. Set up your first monitor (takes 2 minutes)
2. Configure alerts for your team
3. Explore our tutorials

Need help? Reply to this email or check our documentation.

Best,
[Your Name]
```

**Demo Invitation:**
```
Subject: Quick demo of [Product Name]?

Hi [Name],

I noticed you've been exploring [Product Name]. Would you be interested in a 15-minute demo to see how it can help your team?

We can cover:
- Setting up monitors quickly
- Configuring alerts
- Team collaboration features

[Calendar Link]

Best,
[Your Name]
```

**Proposal Follow-up:**
```
Subject: Following up on your [Product Name] proposal

Hi [Name],

Following up on the proposal I sent last week. Do you have any questions or need clarification on anything?

I'm available for a quick call if you'd like to discuss:
- Implementation timeline
- Team training
- Custom configurations

[Calendar Link]

Best,
[Your Name]
```

### Call Scripts

**Discovery Call Script (15 min):**
1. Introduction (2 min)
   - Thank for time
   - Confirm agenda

2. Current Situation (5 min)
   - How do you monitor APIs today?
   - What challenges are you facing?
   - What's the impact of downtime?

3. Desired Outcome (3 min)
   - What would success look like?
   - Key metrics to improve?
   - Timeline for decision?

4. Next Steps (5 min)
   - Demo if interested
   - Proposal timeline
   - Follow-up actions

**Demo Script (30 min):**
1. Agenda & Goals (2 min)
2. Quick Overview (5 min)
3. Live Demo (15 min)
4. Q&A (5 min)
5. Next Steps (3 min)

---

## Sales Metrics Dashboard

### Pipeline Metrics
- **Total Leads:** [Number]
- **MQLs:** [Number] ([%])
- **SQLs:** [Number] ([%])
- **Opportunities:** [Number] ([%])
- **Closed Won:** [Number] ([%])

### Conversion Rates
- Lead to MQL: [%]
- MQL to SQL: [%]
- SQL to Opportunity: [%]
- Opportunity to Closed: [%]
- Overall Conversion: [%]

### Velocity Metrics
- Average time in pipeline: [Days]
- Time per stage: [Days]
- Sales cycle length: [Days]

### Revenue Metrics
- Pipeline value: $[Amount]
- Average deal size: $[Amount]
- Win rate: [%]
- Forecast accuracy: [%]

---

## Sales Team Structure

### Roles & Responsibilities

**Sales Development Representative (SDR)**
- Lead qualification
- Initial outreach
- Demo scheduling
- Pipeline creation

**Account Executive (AE)**
- Discovery calls
- Solution presentation
- Proposal creation
- Deal closing

**Sales Engineer (SE)**
- Technical demos
- Solution architecture
- Integration planning
- Technical validation

**Sales Operations**
- CRM management
- Process optimization
- Analytics & reporting
- Tool administration

### Team Metrics

**SDR Metrics:**
- Leads contacted/day: 50
- Demos scheduled/week: 10
- MQL to SQL conversion: 25%

**AE Metrics:**
- Opportunities managed: 15
- Deal size: $5,000
- Win rate: 40%
- Sales cycle: 30 days

**SE Metrics:**
- Demos delivered/week: 8
- Technical win rate: 80%
- Implementation support: 4 hours/deal

---

## CRM Configuration

### Custom Fields
- **Lead Score:** 0-100
- **Team Size:** 1-5, 6-10, 11+
- **Use Case:** API monitoring, uptime, performance
- **Budget Range:** <$100, $100-500, $500+
- **Decision Timeline:** 1 week, 1 month, 3 months

### Automation Rules
1. **Lead Assignment:** Score > 60 → Assign to AE
2. **Follow-up Reminders:** No activity for 3 days → Send reminder
3. **Stage Progression:** Demo completed → Move to proposal
4. **Win/Loss Tracking:** Deal closed → Update pipeline

### Reporting Views
1. **Pipeline Overview:** All stages, values, owners
2. **Conversion Funnel:** Stage-to-stage conversion rates
3. **Team Performance:** Individual metrics
4. **Forecast View:** 30/60/90 day projections

---

## Training & Enablement

### New Hire Training (Week 1-2)
- Product knowledge
- Sales process
- Tools training
- Role-playing exercises

### Ongoing Training (Monthly)
- Competitive updates
- Product new features
- Sales techniques
- Customer success stories

### Resources Library
- Battle cards (competitors)
- Case studies
- Demo scripts
- Proposal templates
- Objection handling guide

---

## Continuous Improvement

### Weekly Review
- Pipeline health check
- Conversion rate analysis
- Bottleneck identification
- Action plan creation

### Monthly Optimization
- Process refinement
- Tool evaluation
- Training needs assessment
- Goal setting

### Quarterly Planning
- Strategy review
- Target adjustment
- Resource planning
- Performance review