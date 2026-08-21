# DEOS — Digital Entrepreneurship Operating System
## Book 6: Website Platform (Website Builder)

**Version:** 1.0
**Status:** Draft
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 2 (User Platform — Chapters 9 & 10 summarized this module; this Book details it fully)

> This Book fully specifies the Website Builder, Domain/DNS provisioning, hosting, and everything a member's public-facing site depends on — the module Book 0 §9 calls "the front door" every other engine feeds into.

---

## Table of Contents

1. Purpose & Scope
2. Website Builder Editor
3. Templates & Themes
4. Landing Pages
4a. Join / Become a Member Block (Embedded Referral Signup)
5. SEO
6. Blog
7. Forms & Lead Capture
8. Appointments
9. Domain Integration & DNS
10. Hosting, SSL & CDN
11. Business Email
12. Backups
13. Analytics
14. Database & Infrastructure Requirements
15. Acceptance Criteria

---

## 1. Purpose & Scope

Every member's site is provisioned automatically during onboarding (Book 2 Chapter 4) and is the asset that captures leads into the CRM (Book 7) and drives marketplace/storefront sales (Book 5 §10). This Book governs everything from the editing experience (matches Image 11) through to the DNS/hosting infrastructure underneath it.

---

## 2. Website Builder Editor

Matches Image 11 exactly.

**Functional Requirements:**
- Section-based visual editor: Hero, About, Services, Testimonials, Contact, and additional sections addable via a "+" control between existing sections
- Per-section Content / Style / Advanced tabs (right-hand panel)
- Device preview toggle: Desktop / Tablet / Mobile
- Undo/redo, autosave with visible "Saved" status indicator
- Page selector dropdown (Home, and additional pages per Chapter 4 below)

**Business Rule:** Every published change must render identically across the preview and the live public site — no drift between builder preview and production output (Book 2 Chapter 9 acceptance criteria restated here as binding).

---

## 3. Templates & Themes

**Functional Requirements:** curated demo templates by business type (matches Image 11's "Demo 1: Business Coach," "Demo 2: Digital Agency," "Demo 3: Online Store," plus "Start Blank"), theme-level color/font controls applied globally across all sections, template library managed centrally by admins (Book 3 §9).

---

## 4. Landing Pages

**Functional Requirements:** standalone, single-purpose pages (separate from the main site's page set) optimized for a specific campaign or lead magnet — built with the same section editor (§2), but excluded from main site navigation by default. Directly feeds the Marketing Center's Landing Pages tool (Book 2 Chapter 15).

---

## 4a. Join / Become a Member Block (Embedded Referral Signup)

**Executive Summary:** A dedicated section type, addable to any page via the standard "+" control (§2), that turns a member's own website into a live recruiting page — a visitor can register for DEOS directly from that site, with the site owner automatically credited as sponsor, with no code to type or link to click through separately.

**Functional Requirements:**
- New block type in the section library: "Join / Become a Member" — configurable heading, subheading, and call-to-action button text/style, consistent with the existing Hero/About block editing pattern (§2)
- The block's registration button/form is wired at publish time to the member's unique referral code (already generated at their own registration, Book 2 Chapter 2) — this wiring is automatic and requires no manual configuration from the member
- Clicking the block's CTA sends the visitor to the standard registration flow (Book 2 Chapter 2) with the sponsor code pre-filled and **hidden from the visitor** — they experience it as simply "registering on this business's site," not as using a referral code
- Optionally, the block can embed a lightweight registration form directly inline on the page (name/email/plan selection) rather than redirecting off-site, reducing drop-off — full payment step still redirects to the secure checkout flow (Book 2 Chapter 2)

**Business Rule:** If the visitor is already a registered DEOS member (e.g., clicking the block while logged in, or using an email already on file), the block must not attempt to re-register or re-place them — it should recognize the existing account and prevent duplicate/conflicting sponsor assignment. Sponsor assignment happens exactly once, at original registration, per Book 4 §4's rule that the sponsor tree is fixed and never changes.

**Business Rule:** Placement follows Book 4 §5 spillover rules exactly — if the site owner's two leg positions are already filled, the new signup spills over to the next open position in their downline automatically. From the member's perspective, every signup through their site "falls under them" in the sense that they're always the sponsor (§4a above) and always benefit from the resulting Direct Referral Commission (Book 4 §6) and Generation Bonus chain (Book 4 §9) — even when the visitor's placement lands several levels deep in the tree due to spillover.

**Acceptance Criteria:**
- [ ] A registration completed through a member's embedded Join block correctly sets that member as sponsor, with no manual code entry required at any point
- [ ] Spillover placement (if the sponsor's legs are full) works identically whether the visitor arrived via a shared referral link or via the embedded site block — one placement algorithm, two entry points
- [ ] The block cannot be used to re-assign sponsorship for an already-registered visitor

---

## 5. SEO

**Functional Requirements:** per-page meta title/description, auto-generated sitemap.xml and robots.txt, clean URL slugs, image alt-text fields, basic Core Web Vitals monitoring surfaced in Analytics (§13).

**Business Rule:** SEO fields are pre-filled with sensible defaults from page content at creation time (so a non-technical member isn't blocked by an empty required field) but remain fully editable.

---

## 6. Blog

**Functional Requirements:** post editor (reusing the section-based content blocks from §2 where practical), categories/tags, scheduled publishing, RSS feed, comment moderation (or comments disabled by default, member-configurable).

---

## 7. Forms & Lead Capture

**Functional Requirements:** drag-in contact/lead forms tied to page sections, field customization, submission routing directly into CRM Leads (Book 2 Chapter 11) with source attribution intact — this is the specific integration point Book 2 Chapter 11's acceptance criteria already requires.

---

## 8. Appointments

**Functional Requirements:** bookable appointment/consultation slots embeddable on the site, synced to the member's CRM Calendar (Book 2 Chapter 11), automated confirmation/reminder notifications (Book 2 Chapter 17).

---

## 9. Domain Integration & DNS

Fully implements Book 0 §9's Personal Website & Domain Layer and Book 2 Chapter 10.

**Functional Requirements:**
- Subdomain (`username.deos.com`) provisioned automatically and instantly on account activation — before any custom domain step
- Domain search and credit redemption (per plan tier, Book 1 §6)
- Custom domain connection: either register new through DEOS, or connect an externally-owned domain via DNS record instructions (A/CNAME records, clearly displayed with copy-to-clipboard)
- DNS propagation status indicator (pending / verifying / active)

**Business Rule (restated from Book 0 §9, binding here):** publishing the site (§2) works immediately on the subdomain regardless of custom domain DNS propagation status — a member is never blocked from going live while waiting on DNS.

---

## 10. Hosting, SSL & CDN

**Functional Requirements:** automatic SSL certificate issuance and renewal on domain connection (no manual step), CDN-backed asset delivery for site performance, hosting resource limits scaled by plan tier (storage, bandwidth — exact figures to be set alongside Book 1 pricing finalization).

**Business Rule:** SSL provisioning failures must degrade gracefully (site remains reachable over the subdomain/HTTP while custom-domain SSL is retried) rather than taking the site offline.

---

## 11. Business Email

**Functional Requirements:** optional add-on (Book 1 §7.1 ancillary revenue stream) — professional email addresses on the member's custom domain, provisioned through the same Domain Integration flow (§9).

---

## 12. Backups

**Functional Requirements:** automatic scheduled site backups (content, media, configuration), member-accessible restore-to-previous-version, retention window scaled by plan tier.

**Business Rule:** A restore action is logged (who, when, which version) — treated with the same audit rigor as financial actions per Book 0 §11, since restoring an old version can undo real business content (published prices, live forms) a member may not intend to lose.

---

## 13. Analytics

**Functional Requirements:** per-site traffic, source, and conversion analytics surfaced both here and rolled up into the member's Dashboard/Reports (Book 2 Chapters 5 & 18) — matches Image 7's Traffic Analytics section, scoped to a single member's site rather than platform-wide (which is Book 3 §12's job).

---

## 14. Database & Infrastructure Requirements

- `member_sites` — site_id, member_id, subdomain, custom_domain (nullable), dns_status, ssl_status, published_at
- `site_content` — versioned per Book 0 §14 append-only principle, enabling the backup/restore flow (§12) without ad-hoc snapshotting logic
- `site_leads` — foreign key to CRM `leads` table (Book 7), preserving source attribution end-to-end
- `site_referral_blocks` — links a "Join / Become a Member" block instance to the site owner's referral code; registration events originating from this block are tagged with `source: embedded_site_block` (distinct from `source: shared_link`) so Reports (§13, Book 2 Chapter 18) can show members which channel — their site vs. a shared link — is actually driving signups
- Infrastructure provisioning (DNS, SSL, CDN) should be event-driven via the Automation Engine (Book 0 §9) — a "domain connected" event triggers SSL issuance automatically, not through a manually-triggered admin job

---

## 15. Acceptance Criteria

- [ ] Subdomain site is live and publicly reachable within seconds of onboarding step 14 (Book 2 Chapter 4), independent of any custom domain state
- [ ] Builder preview and live published output match exactly across desktop/tablet/mobile
- [ ] Lead form submissions arrive in CRM with source attribution intact, in real time
- [ ] SSL issuance is fully automatic on domain connection, with graceful degradation on failure
- [ ] Site restore actions are logged with full before/after traceability
