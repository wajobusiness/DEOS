# DEOS — Digital Entrepreneurship Operating System
## Book 2: User Platform & User Experience Blueprint

**Version:** 2.0 (Progressive Dashboard States & Email Automation Standard)
**Status:** Approved & Binding
**Governed by:** Book 0 (Constitution) and Book 1 (Business Blueprint)

> This Book specifies every screen, progressive lifecycle state, and workflow a member interacts with, chapter by chapter. Where a chapter maps to an existing UI component or mockup, it is noted explicitly.

---

## Table of Contents

1. Platform Navigation Shell
2. Registration & Referral Attribution Flow
3. Authentication & Security
4. Revised Onboarding Flow & Business Launch Wizard
5. Progressive Dashboard States
6. Profile & Verification
7. Membership & Tier Upgrades
8. Wallet & DEOS Coin Management
9. Dynamic Landing Page Engine & Website Builder
10. Domain Center & DNS Management
11. CRM & Lead Pipeline
12. Public Marketplace & Storefronts
13. Partner Center & Affiliate Campaigns
14. Digital Entrepreneur Academy
15. Email Marketing & Automation Center
16. AI Business Center
17. Notifications & Alerts
18. Reports & Analytics
19. Settings & Security
20. Subscription & Annual Renewal

---

## Chapter 1 — Platform Navigation Shell

**Executive Summary:** A single, consistent sidebar/header shell wraps every sub-app (Dashboard, Wallet, Binary Network, CRM, Marketplace, Academy, Website Builder, AI Center, Settings), per Book 0 §10.

**Functional Requirements:**
- Persistent left sidebar with module icons + labels; collapsible on mobile.
- Global search (`⌘K`) across leads, products, courses, transactions.
- Header shows notification bell, messages, and account menu consistently across all modules.

---

## Chapter 2 — Registration & Referral Attribution Flow

**Executive Summary:** Converts a prospect into a registered member while locking in sponsor referral attribution.

**The Registration Sequence:**
```
[ Dynamic Landing Page (Hero Lead Form) ]
                   │
                   ▼
[ Prospect Contact Captured into Sponsor CRM ]
                   │
                   ▼
[ Registration Page (Sponsor Code Pre-Filled & Locked) ]
                   │
                   ▼
[ Account Created & JWT Session Initiated ]
                   │
                   ▼
[ Redirected to Step 3 of Onboarding (Video Presentation & Wallet) ]
```

**Functional Requirements:**
- Account fields: Full Name, Email, Phone, Country, Password.
- Sponsor/Referral Code field pre-fills automatically from URL parameter (`?ref=DEOS100245`) or embedded website block and is non-editable to protect referral attribution integrity.
- In organic registrations without a referral link, the member is placed under company root per Book 4 placement rules.

---

## Chapter 3 — Authentication & Security

**Functional Requirements:**
- Secure email/password login with JWT session token issuance (7-day validity).
- Two-Factor Authentication (2FA) via Authenticator App / SMS.
- Session manager allowing members to view and revoke active browser sessions.

---

## Chapter 4 — Revised Onboarding Flow & Business Launch Wizard

**Executive Summary:** The 6-step core onboarding sequence (amending legacy Book 17) transitions the user seamlessly from signup to funded business activation:

1. **Step 1 — Registration:** Account creation with immutable sponsor attribution.
2. **Step 2 — Account Created:** Welcome confirmation.
3. **Step 3 — Video Presentation Page:** Full platform walkthrough video player with a prominent **"Continue to Wallet"** action directly below the player.
4. **Step 4 — Activate Wallet:** Dedicated internal wallet instance initialized.
5. **Step 5 — Deposit Funds / Convert to DEOS Coin:** Deposit via USDT (TRC20), Card (Stripe/Paystack), or Bank Transfer; credited as fixed-value DEOS Coin (Model A: $1.00 USD = 1.00 DEOS Coin).
6. **Step 6 — Purchase Plan Tier:** Select Launch (100 DEOS), Growth (300 DEOS), or Legacy (500 DEOS) and check out in DEOS Coin.

### Business Launch Checklist (15 Guided Milestones):
Upon plan purchase, the member receives their 15-step interactive launch wizard:
1. Welcome to DEOS & Plan Overview
2. Confirm Wallet & Security Pin
3. Choose Subdomain & Business Name
4. Connect Custom Domain / Redeem Domain Voucher
5. Select Landing Page Template
6. Upload Brand Logo & Avatar
7. Configure Contact & Social Info
8. Review CRM Lead Pipeline
9. Load Email Marketing Autoresponder Sequence
10. Explore Email Swipe Copy Library
11. Enroll in Academy Starter Masterclass
12. Activate Partner Center Affiliate Links
13. View Binary Tree Placement
14. Publish Dynamic Landing Page Live
15. Complete Business Launch Checklist

---

## Chapter 5 — Progressive Dashboard States

To ensure a clean user experience, the member dashboard dynamically renders in **4 distinct progressive states**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PROGRESSIVE DASHBOARD STATES                         │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ State 1: Registered (Unfunded)       │ • Focus on onboarding & explainer.   │
│                                      │ • Action: "Fund Wallet & Activate".  │
│                                      │ • Gated tools show lock badges.      │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ State 2: Wallet Funded (Unpurchased) │ • Balance in DEOS Coin visible.      │
│                                      │ • Plan tier selector card.           │
│                                      │ • Action: "Activate Membership".     │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ State 3: Membership Activated        │ • Launch wizard checklist.           │
│                                      │ • Subdomain/DNS provisioning setup.  │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ State 4: Active Entrepreneur         │ • Full unlocked operating dashboard. │
│                                      │ • Earnings, BV Tree, CRM, AI, Store. │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## Chapter 8 — Wallet & DEOS Coin Management

**Functional Requirements:**
- 4-Card Balance Strip: Total Wallet Balance, DEOS Coin Utility Balance ($1.00 USD = 1.00 DEOS fixed), USDT Balance (TRC20), Available Withdrawable Balance.
- Quick Actions: Deposit (Multi-rail), Request Withdrawal (Subject to KYC), Internal P2P Transfer.
- Earnings Breakdown Donut: Binary Commission, Direct Bonus, Generation Waterfall, Marketplace Payouts.
- Canonical 14-event transaction ledger table with search, filtering, and export.

---

## Chapter 9 — Dynamic Landing Page Engine & Website Builder

**Functional Requirements:**
- Auto-provisioned single-page business landing page (`username.deos.com`).
- Live Section Visual Editor: Hero, Value Proposition, Video Player, Lead Capture Form, Embedded Join Block, Featured Marketplace Products, and CTA.
- Theme styling: Global brand colors, typography, and avatar uploads.
- Custom domain DNS linking with real-time propagation checker.

---

## Chapter 11 — CRM & Lead Pipeline

**Functional Requirements:**
- Leads table with immutable source attribution (`personal_website`, `facebook_ad`, `manual`).
- 5-Stage Kanban Deal Pipeline (New $\rightarrow$ Qualified $\rightarrow$ Proposal $\rightarrow$ Negotiation $\rightarrow$ Won/Lost).
- Lead details drawer with activity timeline, appointment scheduler, and interaction history.

---

## Chapter 15 — Email Marketing & Automation Center

**Functional Requirements:**
- **Centralized Shared Sending Engine:** Enterprise AWS SES / SendGrid sending pool managed centrally with tenant-scoped quotas.
- **Pre-Built Email Sequences:** 1-click activation for Lead Nurture, Product Launch, and Downline Welcome sequences.
- **Email Swipe Copy Library:** High-converting promo copy for DEOS membership and top marketplace digital products.
- **Personalization Engine:** Dynamic tag replacements (`{{first_name}}`, `{{sponsor_name}}`, `{{affiliate_link}}`).
- **Quota Enforcer:** Tier-scoped sending limits (Launch: 1,000/mo; Growth: 10,000/mo; Legacy: 50,000/mo).
