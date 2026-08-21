# DEOS — Digital Entrepreneurship Operating System
## Book 7: CRM

**Version:** 1.0
**Status:** Draft
**Governed by:** Book 0 (Constitution), Book 2 (User Platform — Chapter 11 summarized this module; this Book details it fully), Book 6 (Website Platform — lead-source integration)

> This Book fully specifies the CRM: how leads captured from a member's website (Book 6) or storefront (Book 5 §10) turn into contacts, deals, and revenue. Matches Image 10.

---

## Table of Contents

1. Purpose & Scope
2. Leads
3. Contacts & Companies
4. Deals & Pipeline
5. Tasks & Calendar
6. Appointments
7. Communication (Email, SMS, Calls, Live Chat)
8. Automation & Workflows
9. Forms
10. Reports & Insights
11. Database Requirements
12. Acceptance Criteria

---

## 1. Purpose & Scope

The CRM is where a member converts traffic (from their website, storefront, or marketing campaigns) into paying customers. It is deliberately part of the same membership bundle described in Book 1 — not a separate purchase — because Book 0 §6 treats "a real functioning business" as the product, and a business without a way to manage customers isn't functioning.

---

## 2. Leads

**Functional Requirements:** lead list with source, status (New/Contacted/Qualified), created date; matches Image 10's Recent Leads table exactly. Leads arrive automatically from:
- Website contact forms (Book 6 §7) — source-tagged
- Marketplace storefront inquiries (Book 5 §10)
- Manual entry
- Marketing Center campaign responses (Book 2 Chapter 15)

**Business Rule:** Source attribution is immutable once a lead is created — required for the Lead Sources analytics (§10) to remain trustworthy, and because a member may want to evaluate which channel (website vs. storefront vs. campaign) is actually working.

---

## 3. Contacts & Companies

**Functional Requirements:** contact records (name, email, phone, associated company), company records grouping multiple contacts, interaction history timeline (every email/call/form submission tied to the contact record).

---

## 4. Deals & Pipeline

Matches Image 10's Deals Pipeline funnel exactly.

**Functional Requirements:** configurable pipeline stages (default: New → Qualified → Proposal → Negotiation → Won/Lost), drag-and-drop stage movement, deal value tracking, forecast revenue (matches Image 10's "Deals Forecast" card with quarterly goal progress).

**Business Rule:** A "Won" deal does not automatically create a marketplace transaction or wallet entry — CRM deals track the member's own external sales process; only actual Marketplace transactions (Book 5) generate commission ledger entries. This boundary must be clear to members: CRM revenue tracking is for their own business insight, not a trigger for platform-level commission.

---

## 5. Tasks & Calendar

**Functional Requirements:** task list with due dates and priority, calendar view integrating tasks, appointments (§6), and deal follow-ups in one place — matches Image 10's "My Tasks" and "Upcoming Activities" panels.

---

## 6. Appointments

**Functional Requirements:** shares the same booking engine defined in Book 6 §8 (Website Platform) — this chapter is the CRM-side management view of appointments booked through the member's public site, plus the ability to manually schedule appointments with existing contacts.

---

## 7. Communication (Email, SMS, Calls, Live Chat)

**Functional Requirements:** send/track emails and SMS directly from a contact record (matches Image 10's sidebar: Emails, SMS, Calls, Live Chat), call logging (manual entry, since native calling is out of scope for v1.0), live chat widget embeddable on the member's website (Book 6), routing chat conversations into the CRM as contact interactions.

**Business Rule:** Sending volume (email/SMS) is capped by plan tier per Book 1 §6 — enforced consistently with the Marketing Center's own sending limits (Book 2 Chapter 15), since both draw from the same underlying send infrastructure.

---

## 8. Automation & Workflows

**Functional Requirements:** rule-based automation (e.g., "when a lead is tagged Qualified → assign to pipeline → send welcome email → create follow-up task") — this is a CRM-scoped instance of the platform-wide Automation Engine defined in Book 0 §9, reusing the same underlying trigger/action architecture rather than building a separate one.

---

## 9. Forms

**Functional Requirements:** CRM-side management of forms embedded on the member's site (Book 6 §7) — field configuration, submission routing rules, and integration with Automation (§8) so a specific form submission can trigger a specific workflow.

---

## 10. Reports & Insights

Matches Image 10's Leads Overview and Lead Sources panels.

**Functional Requirements:** conversion rate tracking (Leads → Converted), lead source breakdown (Website Form, Facebook Ads, LinkedIn, Referral, Other), pipeline value by stage, forecast vs. goal progress. Rolls up into the member's platform-wide Reports (Book 2 Chapter 18).

---

## 11. Database Requirements

- `crm_leads` — lead_id, member_id, source, status, created_at, converted_at (nullable)
- `crm_contacts`, `crm_companies`, `crm_deals` — standard relational structure, deals linked to pipeline_stage and forecast_value
- `crm_interactions` — polymorphic log of emails/calls/SMS/chat tied to a contact, for the interaction timeline (§3)
- Lead source field must trace back to Book 6's `site_leads` foreign key where applicable (§2's immutability rule enforced at the schema level, not just the UI)

---

## 12. Acceptance Criteria

- [ ] Every lead captured via the member's website or storefront lands in CRM within seconds, with source intact and unchangeable
- [ ] Pipeline forecast figures reconcile with what's shown on the member's Dashboard (Book 2 Chapter 5)
- [ ] CRM "Won" deals are clearly and permanently distinguished from Marketplace transactions in the UI, so members never confuse the two revenue tracks
- [ ] Automation workflows (§8) execute reliably from the shared Automation Engine, with a visible execution log per workflow run
