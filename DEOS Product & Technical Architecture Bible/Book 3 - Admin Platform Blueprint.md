# DEOS — Digital Entrepreneurship Operating System
## Book 3: Admin Platform Blueprint

**Version:** 1.0
**Status:** Draft
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 2 (User Platform), Book 4 (Binary Engine), Book 5 (Marketplace)

> This Book defines everything platform administrators can see, configure, and act on — matching Images 1 and 2 (Admin Panel dashboards). Every admin capability referenced but not defined in Books 2, 4, and 5 (dispute handling, fraud review, fund management, role permissions) is specified here.

---

## Table of Contents

1. Purpose & Scope
2. Admin Roles & Permissions
3. Admin Dashboard
4. User Management
5. Membership & Subscription Management
6. Binary & Commission Management
7. Marketplace Management
8. Academy Management
9. CMS & Website Templates
10. Finance & Treasury
11. Support & Dispute Resolution
12. Analytics & Reports
13. System Configuration
14. Audit Logs
15. Acceptance Criteria

---

## 1. Purpose & Scope

The Admin Platform is where DEOS staff operate the business day-to-day: managing members, resolving disputes, configuring commission rules within the bounds Books 4 and 5 define, moderating marketplace content, and monitoring platform health. It is intentionally **desktop-first** (Book 2 Chapter 1's UI principle) since admin work is deep-configuration work, not on-the-go work.

---

## 2. Admin Roles & Permissions

Per Book 0 §11's least-privilege principle, admin access is role-scoped, matching Image 6's Roles & Permissions pattern:

| Role | Access |
|---|---|
| **Super Admin** | Full access to all features and settings, including commission rate changes (with mandatory audit log, §14) |
| **Manager** | Team and project management; cannot alter commission rules or Treasury |
| **Editor** | CMS/content creation only |
| **Analyst** | View reports and analytics only, no mutation rights |
| **Support** | Customer support tools, ticket management, limited user account actions (no financial mutation) |
| **Finance** | Wallet, payout, and Treasury management specifically — separated from general Super Admin so financial approval requires a distinct, accountable role |

**Business Rule:** No single role other than Super Admin can both *change* a commission rule and *approve* its resulting payouts — this separation of duties prevents a single compromised or malicious account from both rigging and cashing out a change.

---

## 3. Admin Dashboard

Matches Images 1 and 2 exactly.

**Functional Requirements:**
- Summary cards: Total Members, Active Members, New Registrations, Total Revenue, Total Payouts, Pending Payouts
- Platform Overview chart (Revenue/Members/Registrations trend)
- Revenue Breakdown donut (Membership Plans, Binary Commissions, Marketplace, Hosting & Domain, Others)
- Recent Transactions feed
- Top Performing Plans table
- Quick Actions (Add New User, Create Plan, Approve Payout, Add Product, Create Webinar, Send Notification)
- System Status panel (Website, Database, Payment Gateway, Mail Service, Backup System, AI Service, Blockchain Network — all "Operational" indicators)
- Management Modules grid — one-click access to every module below

**Acceptance Criteria:**
- [ ] Pending Payouts figure reconciles exactly with the Finance module's approval queue (§10) — no discrepancy between summary card and actual queue

---

## 4. User Management

Matches Image 2's User Management panel.

**Functional Requirements:** searchable/filterable member list (by plan, status), KYC/verification status, activity/permissions, account suspension/ban, manual sponsor/placement correction (with mandatory reason + audit log, since Book 4 §13 marks tree placement as immutable by default — this is the controlled exception path).

**Business Rule:** Manual placement correction is a Super Admin-only action, logged with before/after state, and must never retroactively alter already-paid historical commissions (Book 0 §14) — only future calculations use the corrected placement.

---

## 5. Membership & Subscription Management

**Functional Requirements:** view/edit plan definitions (price, BV, inclusions — within Book 1 §6 bounds), manage annual renewal states, process manual renewal/reactivation, handle plan upgrade edge cases.

**Business Rule:** Changing a plan's price or BV value going forward must never retroactively alter the BV/commission history of members who already purchased at the old price (Book 0 §14 append-only).

---

## 6. Binary & Commission Management

This is the admin surface for everything Book 4 and Book 5 define mathematically.

**Functional Requirements:**
- View any member's binary tree (sponsor tree and placement tree separately, per Book 4 §4)
- Commission rate configuration screen — **all rate fields here must be locked to Book 4/5's confirmed v1.1 values** (10% binary, 30%/15% generation, 3% upline override) until a formal Book revision process changes them; the admin UI itself should require a "confirm against current Book version" step before saving a rate change, to prevent an admin from silently drifting the live system out of sync with the documentation
- Split Commission and unqualified-ancestor fallback monitoring — dashboard view of how much has routed to the Platform Sustainability Fund via each fallback path (Book 4 §8, §9; Book 5 §8), since this is the number Book 4 §11's simulator needs real data on
- Manual commission adjustment (reversal/correction) — always as a new reversing ledger entry (Book 0 §14), never an edit to history, with mandatory reason and Finance-role approval

**Acceptance Criteria:**
- [ ] Any commission rate change is blocked unless it matches a currently-approved Book 4/5 version, or is submitted with an explicit "Book revision" reference

---

## 7. Marketplace Management

**Functional Requirements:** product listing review/moderation queue (Book 5 §3 content policy enforcement), category management, commission-band enforcement (10–60% hard limit, Book 1 §6), dispute handling for buyer/seller/promoter conflicts, refund processing (triggers the reversing ledger flow from Book 5 §6).

---

## 8. Academy Management

**Functional Requirements:** course/content management, instructor approval and payout tracking (Book 1 §7.1 academy revenue stream), certification issuance, live class scheduling (matches Image 5's Events & Webinars admin view).

---

## 9. CMS & Website Templates

**Functional Requirements:** manage the template library members choose from in the Website Builder (Book 2 Chapter 9), manage the public marketing site content (Image 16), manage demo template previews.

---

## 10. Finance & Treasury

**Functional Requirements:**
- Payout approval queue (matches the "Pending Payouts" dashboard card, §3) — Finance-role approval required before funds release, per §2's separation of duties
- Platform Sustainability Fund balance and inflow tracking — specifically visualizing inflows from Split Commission fallback (Book 4 §8), unqualified Generation Bonus fallback (Book 4 §9), and Upline Override fallback (Book 5 §8), since these three funding sources were confirmed in v1.1 and now need real monitoring
- Wallet/token management (deposits, withdrawals, conversions) — admin oversight view of Book 2 Chapter 8's member-facing wallet
- Revenue allocation reporting against the Book 1 §7.3 illustrative model, to validate it with real numbers over time

**Acceptance Criteria:**
- [ ] Treasury dashboard can answer, at any time: "what % of platform revenue this period came from commerce (marketplace) vs. network (binary/direct/generation)?" — this is the number that matters most for Book 0 §5's constitutional commitment

---

## 11. Support & Dispute Resolution

Matches Image 3 (Support & Community) from the member side; this chapter is the admin-side counterpart.

**Functional Requirements:** ticket queue, live chat handling, escalation paths, commission dispute review workflow (a member disputing a payout amount must be able to see the exact rule and ledger entries that produced it, per Book 0 §10's transparency principle — admin tools should make this lookup fast, not require engineering involvement).

---

## 12. Analytics & Reports

Matches Image 7's Analysis dashboard, admin-scoped: platform-wide (not per-member) traffic, sales, customer, marketing, and financial analysis; exportable reports; scheduled reports for leadership.

---

## 13. System Configuration

Matches Image 2's Settings panel: platform name/tagline, timezone/date format defaults, payment settings, security settings, integrations, backup/restore, maintenance mode.

---

## 14. Audit Logs

Implements Book 0 §11's immutable audit log requirement at the admin-UI level: searchable, filterable log of every admin action (who, what, when, before/after state), with special emphasis on financial and commission-rule changes (§6) and manual placement corrections (§4).

**Acceptance Criteria:**
- [ ] Every action listed in this Book that carries a "mandatory audit log" or "mandatory reason" note actually produces a corresponding, searchable audit log entry — no exceptions

---

## 15. Acceptance Criteria

- [ ] Role permission matrix (§2) enforced at the API level, not just hidden in the UI — a Support-role account must be rejected server-side if it attempts a Finance-role action
- [ ] Commission rate configuration (§6) cannot drift from the current approved Book 4/5 version without an explicit, logged revision reference
- [ ] Treasury dashboard (§10) can report commerce-vs-network revenue split on demand — this is the ongoing, real-world check on Book 0 §5's founding principle, not just a launch-time legal review
- [ ] All admin actions with financial or tree-structure impact are immutably logged (§14)
