# DEOS — Digital Entrepreneurship Operating System
## Book 2: User Platform & User Experience Blueprint

**Version:** 1.0
**Status:** Draft
**Governed by:** Book 0 (Constitution) and Book 1 (Business Blueprint) — this Book must not contradict either

> This Book specifies every screen and workflow a member interacts with, chapter by chapter, matching the structure your original outline defined (Chapters 1–20). Each chapter follows the standard format from Book 0 §17: Executive Summary, Functional Requirements, UI/UX Description, User Workflow, Business Rules, and Acceptance Criteria. Where a chapter maps to a mockup you've already shared, it's noted explicitly.

---

## Table of Contents

1. Platform Navigation
2. Registration
3. Authentication
4. User Onboarding (Business Launch Wizard)
5. Dashboard
6. Profile
7. Membership
8. Wallet
9. Website Builder
10. Domain Center
11. CRM
12. Marketplace
13. Partner Center
14. Academy
15. Marketing Center
16. AI Business Center
17. Notifications
18. Reports
19. Settings
20. Subscription

---

## Chapter 1 — Platform Navigation

**Executive Summary:** A single, consistent sidebar/header shell wraps every sub-app (Dashboard, Wallet, Binary Network, CRM, Marketplace, Academy, Website Builder, AI Center, Settings), per Book 0 §10.

**Functional Requirements:**
- Persistent left sidebar with module icons + labels; collapsible on mobile.
- Global search (`⌘K`) across leads, products, courses, transactions — visible in every mockup's header.
- Header shows notification bell, messages, and account menu consistently across all modules.

**UI/UX Description:** Matches the dark-sidebar / light-canvas pattern shown across Images 1–18 — each sub-app (CRM, Marketplace, Academy, Wallet) keeps the same shell but re-skins its icon and top-left label (e.g., "DEOS CRM," "DEOS Wallet") so members always know which engine they're in without losing the sense of one platform.

**Business Rules:** Navigation items are permission-gated by plan tier and role (member vs. admin) — Book 0 §11 least-privilege principle applies here.

**Acceptance Criteria:**
- [ ] Sidebar renders identically in structure across all modules, differing only in icon/label and menu items
- [ ] Search returns results scoped to the member's own data only

---

## Chapter 2 — Registration

**Executive Summary:** Converts a visitor from the public marketing site (Image 16) into a paying member in the fewest possible steps.

**Functional Requirements:**
- Plan selection (Launch/Growth/Legacy) with price and inclusions shown before payment.
- Account fields: name, email, phone, country, password.
- Optional sponsor/referral code field — pre-fills from a referral link if the visitor arrived via one.
- Payment step (card, bank transfer, or wallet — per Book 10).
- **Site-embedded registration entry point:** a visitor can also register directly from a member's own website via the "Join / Become a Member" block (full spec in Book 6 §4) — in this path, the sponsor/referral code field is pre-filled automatically and hidden from the visitor entirely, since the member's site itself is the referral source. This is functionally identical to arriving via a referral link, just delivered through the member's own domain instead of a shared URL.

**User Workflow:** Visitor → Select Plan → Enter Details → Enter/Confirm Sponsor → Pay → Account Created → redirected into Business Launch Wizard (Chapter 4).

**Business Rules:** A member without a sponsor code is placed under a default/company placement position per Book 4's placement algorithm — never left unplaced.

**Validation Rules:** Email uniqueness, phone format by country, sponsor code must reference an active member.

**Acceptance Criteria:**
- [ ] Registration cannot complete without successful payment confirmation
- [ ] Sponsor placement is recorded atomically with account creation (no orphaned accounts)

---

## Chapter 3 — Authentication

**Executive Summary:** Standard secure login plus account recovery, aligned with Book 0 §11 security principles.

**Functional Requirements:**
- Email/password login, "remember me," forgot-password flow.
- Optional two-factor authentication (referenced in Image 4's Account & Security settings).
- Session management: view/revoke active sessions.

**Security Considerations:** Passwords hashed (never stored plain), rate-limited login attempts, 2FA via SMS/authenticator app.

**Acceptance Criteria:**
- [ ] Account lockout after repeated failed attempts, with recovery path
- [ ] 2FA, once enabled, is required on every new-device login

---

## Chapter 4 — User Onboarding (Business Launch Wizard)

**Executive Summary:** The guided first-run experience that takes a new member from "just paid" to "website live" — this is the single most important retention moment in the platform per Book 1 §14 (time-to-published-website is a core success metric).

**Functional Requirements — the 15-step wizard:**
1. Welcome to DEOS
2. Confirm membership plan
3. Set up wallet
4. Choose business name
5. Search & redeem domain credit
6. Select website template
7. Upload logo & brand colors
8. Configure contact info
9. Connect social media accounts
10. Set up CRM basics
11. Enroll in Academy starter path
12. Activate Partner Center
13. Join binary network (confirm/view placement)
14. Publish website
15. Receive personalized launch checklist

**UI/UX Description:** Step-by-step wizard with progress indicator; each step writes to the member's profile/site config immediately (no "lost progress" on exit — member can resume later from Dashboard).

**Business Rules:** Domain credit redemption is one-time per membership; skipping optional steps (e.g., social accounts) is allowed, but publishing (step 14) requires steps 4–8 complete.

**Acceptance Criteria:**
- [ ] Member can exit and resume the wizard from any step without data loss
- [ ] Website is live and reachable at the assigned subdomain immediately after step 14, before any custom domain DNS propagation completes

---

## Chapter 5 — Dashboard

**Executive Summary:** The member's home screen — earnings, business website status, team overview, academy progress, and quick actions in one view. Directly matches Image 18.

**Functional Requirements (from mockup):**
- Summary cards: Total Earnings, Wallet Balance, Binary Volume (BV), Active Referrals, Rank
- Earnings Overview chart + Earnings Breakdown donut (Binary/Partner/Generation/Marketplace)
- "Your Business Website" card — live status, last updated, edit/view actions
- "Domain & Hosting" card — renewal date, hosting/SSL status
- AI Business Assistant shortcut
- Quick Actions grid (Deposit, Withdraw, Buy BV, Invite, Add Product, Create Campaign, AI Writer, Help)
- My Team Overview (team size, left/right split)
- Academy Progress (current course, % complete)
- Marketplace Overview (products, sales, orders, commission earned)

**Business Rules:** Every earnings figure shown must link to its underlying transaction list and rule explanation (Book 0 §10 transparency principle).

**Acceptance Criteria:**
- [ ] All dashboard figures reconcile exactly with Wallet (Chapter 8) and Reports (Chapter 18) data — no discrepancy between summary and detail views

---

## Chapter 6 — Profile

**Executive Summary:** Personal and business identity information, distinct from Settings (Chapter 19) which covers system preferences.

**Functional Requirements:** Name, photo, contact info, business/company info (matches Image 4's Profile + Company Information sections), bio/about, social links.

**Acceptance Criteria:**
- [ ] Profile changes propagate to the public-facing website "About" section if the member opts in

---

## Chapter 7 — Membership

**Executive Summary:** View current plan, compare tiers, and upgrade — separate from Subscription (Chapter 20), which handles the annual renewal specifically.

**Functional Requirements:** Current plan display (matches Image 18's "Current Plan: GROWTH" card), plan comparison table, upgrade flow with prorated/upgrade-fee logic defined in Book 4.

**Business Rules:** Upgrading plan tier does not retroactively change historical commission eligibility — only future transactions use the new tier (Book 0 §14 append-only principle).

**Acceptance Criteria:**
- [ ] Upgrade flow clearly discloses new commission tier and any upgrade cost before confirmation

---

## Chapter 8 — Wallet

**Executive Summary:** Manages all fund movement — matches Image 17 in full detail.

**Functional Requirements:**
- Balance cards: Total Wallet Balance, Token Balance, USDT/fiat Balance, Available Balance
- Actions: Deposit, Withdraw, Transfer (to another member), Convert (token ↔ fiat)
- Earnings Summary by source (Binary Bonus, Partner Commission, Marketplace Earnings, Generation Bonus, Other)
- Wallet Allocation breakdown
- Recent Transactions and Recent Conversions with full history

**Business Rules:** Every wallet transaction is append-only per Book 0 §14; withdrawals may require KYC per Book 0 §11.

**Security Considerations:** Withdrawal requests above a threshold require additional verification step.

**Acceptance Criteria:**
- [ ] Every earning type shown in the Wallet traces to the exact ledger event type defined in Book 0 §9 (`binary_commission`, `direct_referral_bonus`, `product_sale_upline_override`, etc.) — no earning appears in the wallet without a corresponding typed ledger entry

---

## Chapter 9 — Website Builder

**Executive Summary:** Drag-and-drop site editor — matches Image 11.

**Functional Requirements:**
- Template selection (demo templates + "start blank")
- Section-based editing (Hero, About, Services, Testimonials, Contact, etc.) with inline content + style controls
- Responsive preview (desktop/tablet/mobile toggle)
- Publish/unpublish, with autosave ("Saved" indicator)
- Social links management

**UI/UX Description:** Right-hand panel splits into Content / Style / Advanced tabs, matching the mockup exactly.

**Business Rules:** Publishing a site requires domain/subdomain to be provisioned (Chapter 10) first — enforced as a pre-publish check.

**Acceptance Criteria:**
- [ ] Changes autosave within 2 seconds of edit
- [ ] Preview across device sizes matches live published output pixel-for-pixel

---

## Chapter 10 — Domain Center

**Executive Summary:** Manages the member's subdomain and custom domain, tied directly to Book 0 §9's Personal Website & Domain Layer.

**Functional Requirements:** Domain search/redeem (using plan credit), DNS status, SSL status, renewal date, custom domain connect flow.

**Business Rules:** Non-renewal triggers automatic fallback to subdomain (Book 0 §12.3) — never deletion.

**Acceptance Criteria:**
- [ ] Domain connection status is real-time accurate (reflects actual DNS/SSL provisioning state, not a cached assumption)

---

## Chapter 11 — CRM

**Executive Summary:** Lead and deal management — matches Image 10.

**Functional Requirements:**
- Leads, Contacts, Companies, Deals (pipeline view), Tasks, Appointments, Calendar
- Communication: Emails, SMS, Calls, Live Chat
- Automation: Workflows, Campaigns, Forms
- Reports/Insights (conversion rate, lead source breakdown, deals forecast)

**User Workflow:** Website contact form submission → auto-creates Lead → assignable to pipeline stage → convertible to Deal → tracked to Won/Lost.

**Acceptance Criteria:**
- [ ] Leads captured via the member's own website (Chapter 9) land in CRM automatically, with source attribution intact

---

## Chapter 12 — Marketplace

**Executive Summary:** Buy, sell, and promote products — matches Image 15, and implements the Product & Commission Engine from Book 0 §9.

**Functional Requirements:**
- Browse/search/category filter, cart, checkout
- Seller flow: list product, set price, set affiliate commission % (within platform band), view sales
- Promoter flow: browse, generate affiliate link, track clicks/conversions (Partner Center, Chapter 13)
- Platform transaction fee applied automatically at checkout

**Business Rules:** Commission band enforced (10–60% per Book 1 §6); fee/commission/override split calculated per Book 0 §9's flow diagram at the moment of sale, not after the fact.

**Acceptance Criteria:**
- [ ] A completed sale generates exactly one `platform_fee`, one `promoter_commission`, one `upline_override` (if applicable), and one `seller_payout` ledger entry — reconciling to 100% of sale price

---

## Chapter 13 — Partner Center

**Executive Summary:** The affiliate/promoter workspace — matches Image 14 (Seller Dashboard) conceptually, for the promoter side.

**Functional Requirements:** Browse promotable products, generate links, personal storefront management, click/conversion analytics, commission history, withdrawal request.

**Acceptance Criteria:**
- [ ] Storefront sales correctly attribute to the storefront owner as promoter, distinct from direct marketplace sales

---

## Chapter 14 — Academy

**Executive Summary:** Learning platform — matches Image 12.

**Functional Requirements:** Courses, Learning Paths, Live Classes, Workshops, Certifications, Instructor Directory, Discussions, Study Groups, progress tracking, bookmarks.

**Business Rules:** Plan tier gates premium/certification content per Book 1 §6.

**Acceptance Criteria:**
- [ ] Progress tracking persists accurately across devices/sessions

---

## Chapter 15 — Marketing Center

**Executive Summary:** Campaign and content tools — matches Image 8.

**Functional Requirements:** Email Marketing, SMS Marketing, Social Media Planner, Push Notifications, Automation Workflows, Lead Magnets, Landing Pages, Forms & Surveys, Chatbot Builder, Analytics Dashboard, A/B Testing, UTM Builder.

**Acceptance Criteria:**
- [ ] Campaign sends respect member's plan-tier sending limits and log delivery/open/click metrics accurately

---

## Chapter 16 — AI Business Center

**Executive Summary:** AI-assisted content and business tools — matches Image 9.

**Functional Requirements:** AI Content Creator, Image Studio, Chat Assistant, Voiceover, Code Generator, Business Plan generator, Email Writer, Ad Copy Generator, Social Media Post generator, Data Analyzer; credit-based usage tracked against plan allowance.

**Business Rules:** Per Book 0 §16, all AI-generated content must be clearly disclosed as such and remain fully editable before publishing.

**Acceptance Criteria:**
- [ ] AI credit usage is metered accurately per generation and visible to the member in real time

---

## Chapter 17 — Notifications

**Executive Summary:** Cross-platform alerts — email, SMS, push, in-app — for account, financial, and business events.

**Functional Requirements:** Notification preferences by category (matches Image 4's toggle pattern); notification center/bell dropdown.

**Acceptance Criteria:**
- [ ] Every financial ledger event (Chapter 8) triggers a corresponding notification within the member's preferences

---

## Chapter 18 — Reports

**Executive Summary:** Deep analytics across website, marketplace, CRM, and earnings — matches Image 7.

**Functional Requirements:** Performance Overview, Traffic Source, Sales Analysis, Customer Insights, Marketing Analysis, Financial Analysis, custom/scheduled reports, export.

**Acceptance Criteria:**
- [ ] All report figures reconcile with Dashboard (Chapter 5) and Wallet (Chapter 8) — single source of truth, no drift between views

---

## Chapter 19 — Settings

**Executive Summary:** System preferences — matches Image 4.

**Functional Requirements:** General (profile/company), Account & Security, Billing & Subscription, Notifications, Integrations, Brand Settings, Team & Permissions, Data & Privacy, System Settings, Help & Support.

**Acceptance Criteria:**
- [ ] Data & Privacy section provides a working data export and account deletion request flow

---

## Chapter 20 — Subscription

**Executive Summary:** Manages the $50/year renewal specifically (distinct from initial Membership purchase, Chapter 7).

**Functional Requirements:** Renewal date display, auto-renew toggle, payment method management, renewal history, lapse/reactivation flow.

**Business Rules:** Implements Book 0 §12.3 exactly — lapse disconnects custom domain and falls back to subdomain without data loss; renewal restores custom domain automatically.

**Acceptance Criteria:**
- [ ] Reactivation after lapse restores the exact previous domain connection without requiring the member to reconfigure DNS manually
