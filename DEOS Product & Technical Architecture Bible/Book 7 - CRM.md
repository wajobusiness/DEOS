# DEOS — Digital Entrepreneurship Operating System
## Book 7: CRM & Email Marketing Automation

**Version:** 2.0 (Centralized Multi-Tenant CRM & Email Marketing Standard)
**Status:** Approved & Binding
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 2 (User Platform), Book 6 (Landing Page Platform)

> This Book specifies the centralized CRM and Email Marketing Automation engine: how leads captured from an entrepreneur's dynamic landing page or storefront turn into lifelong customers and team members.

---

## Table of Contents

1. Purpose & Scope
2. Multi-Tenant CRM Architecture & Data Isolation
3. Lead Ownership & Immutable Source Attribution
4. Contacts, Companies & Activity Timelines
5. 5-Stage Kanban Deals Pipeline
6. Tasks & Calendar Integration
7. Centralized Email Marketing Architecture
   * 7a. Shared Sending Infrastructure & Deliverability Engine
   * 7b. Pre-Built Email Sequences & Autoresponders
   * 7c. Curated Email Swipe Copy Library
   * 7d. Dynamic Personalization Engine
   * 7e. Membership-Based Sending Limits
8. Communication Channels (Email, SMS, Live Chat)
9. Automated Workflows & Triggers
10. Forms Integration
11. Reports & Pipeline Insights
12. Database & Ledger Requirements
13. Acceptance Criteria

---

## 1. Purpose & Scope

The CRM and Email Marketing engine gives every entrepreneur an automated sales assistant. It eliminates the need for expensive third-party CRM and email software (e.g., HubSpot, Mailchimp) by providing a unified, pre-configured pipeline directly connected to the member's dynamic landing page and marketplace stores.

---

## 2. Multi-Tenant CRM Architecture & Data Isolation

- **One Company-Owned Infrastructure:** All CRM records, email queues, and deal funnels run on DEOS's centralized multi-tenant database.
- **Tenant Data Isolation:** Every lead record, contact, note, and campaign is stamped with a mandatory `member_id` foreign key. Row-Level Security (RLS) ensures that members can only view and manage their own client records.

---

## 3. Lead Ownership & Immutable Source Attribution

- **Entrepreneur Ownership:** The entrepreneur owns their customer and lead relationships. If a member ever leaves or cancels, they can export their full contact list and communication history to CSV/JSON.
- **Immutable Source Attribution:** When a lead is captured, its `source` field (e.g., `personal_website`, `facebook_campaign`, `storefront_inquiry`) is permanently locked to guarantee accurate ROI and analytics.

---

## 4. Contacts, Companies & Activity Timelines

- Contact Records: Name, Email, Phone, Company, Status, Deal Value, and Tags.
- Activity Timeline: Chronological feed tracking form submissions, email opens, link clicks, notes, appointments, and purchase history.

---

## 5. 5-Stage Kanban Deals Pipeline

Visual pipeline with drag-and-drop movement across 5 default stages:
1. **New Lead:** Prospect captured via landing page form.
2. **Qualified:** Prospect verified (engaged with video, email, or chat).
3. **Proposal / Offer:** Prospect presented with digital product, service, or membership.
4. **Negotiation:** Prospect reviewing payment options.
5. **Won / Lost:** Conversion completed or closed.

---

## 7. Centralized Email Marketing Architecture

### 7a. Shared Sending Infrastructure & Deliverability Engine
- Enterprise sending pool using AWS SES / SendGrid with dedicated IP warmup, DKIM, SPF, and DMARC enforcement.
- Bounce and spam complaint processing handled automatically by background worker queues.

### 7b. Pre-Built Automated Email Sequences
Entrepreneurs can activate 1-click automated sequences:
1. **Lead Nurture Sequence (5-Part):** Introduces the entrepreneur's story, shares free value, and drives traffic to featured marketplace offers.
2. **Product Launch Autoresponder (3-Part):** Educates leads on specific digital courses or software with direct purchase links.
3. **Downline Member Onboarding Sequence:** Welcomes newly sponsored team members and guides them through the Business Launch Wizard.

### 7c. Curated Email Swipe Copy Library
The platform provides high-converting, company-curated promo copy templates:
- 1-Click Load: Members can select any swipe template and instantly insert it into their email campaign editor.
- Customization: Members can edit text, adjust tone, and add personal anecdotes.

### 7d. Dynamic Personalization Engine
Supports automatic token substitution at send time:
- `{{first_name}}` $\rightarrow$ Lead's first name
- `{{sponsor_name}}` $\rightarrow$ Entrepreneur's full name
- `{{sponsor_email}}` $\rightarrow$ Entrepreneur's email
- `{{affiliate_link}}` $\rightarrow$ Entrepreneur's unique referral link with UTM tracking
- `{{store_link}}` $\rightarrow$ Entrepreneur's custom domain storefront

### 7e. Membership-Based Sending Limits
To protect shared domain deliverability and align with platform economics:
- **Launch Tier ($100):** Up to **1,000 email sends / month** (Basic Autoresponder).
- **Growth Tier ($300):** Up to **10,000 email sends / month** (Full Multi-Step Sequences).
- **Legacy Tier ($500):** Up to **50,000 email sends / month** (Advanced Behavioral Workflows + Custom Domain Sending).
