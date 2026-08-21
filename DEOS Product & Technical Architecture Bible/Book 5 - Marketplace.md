# DEOS — Digital Entrepreneurship Operating System
## Book 5: Marketplace

**Version:** 1.1 — Upline Override rate and inactive-sponsor fallback confirmed with founder on this date; still pending Book 0 Appendix C legal review and the Book 4 §11 compensation simulator before production implementation
**Status:** Draft — commission math confirmed; subject to the same legal/simulator gate as Book 4 (Book 0 Appendix C)
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 4 (Binary Engine — cross-referenced, not duplicated)

**v1.1 change log:**
- Upline Override Rate confirmed at **3% of promoter commission** (not 10% or 20% — a deliberately conservative rate)
- Inactive-sponsor fallback confirmed: override is still deducted from the promoter's commission and routes to the Platform Sustainability Fund, regardless of sponsor status

> This Book defines the marketplace: how products are listed, sold, promoted, and how revenue splits between platform, seller, promoter, and upline. This is the module Book 1 identified as the commerce leg that must carry real weight alongside the binary engine — so its numbers matter as much as Book 4's.

---

## Table of Contents

1. Purpose & Scope
2. Seller Center
3. Product Listing Rules
4. Partner Center / Affiliate Flow
5. Orders & Checkout
6. Payments
7. Commission & Fee Split Engine
8. The Upline Override
9. Worked Examples
10. Storefronts
11. Reviews & Trust
12. Coupons & Campaigns
13. Analytics
14. Database & Ledger Requirements
15. Acceptance Criteria

---

## 1. Purpose & Scope

The Marketplace is where members sell digital products, physical products, and services, and where other members promote those listings for a commission. This Book governs that entire commerce flow — separate from, but interoperable with, the binary/referral system in Book 4. Per Book 0 §9 and Book 4 §1, every dollar here is ledgered under its own distinct event types so this module's revenue is independently measurable — the metric that keeps DEOS from being "just" a recruitment platform.

---

## 2. Seller Center

Matches Image 14. A member becomes a seller by listing their first product — no separate application required at Launch tier; higher tiers unlock lower platform fees or higher listing limits (exact tier benefits to be finalized with Book 1 pricing team).

**Functional Requirements:**
- Product upload (digital file, physical item, or service description)
- Pricing, inventory (for physical/limited digital), and description
- Affiliate commission rate setter (§7)
- Sales dashboard: revenue, orders, affiliate sales, pending payout (matches Image 14 exactly)

---

## 3. Product Listing Rules

- Category selection from a fixed taxonomy (Digital Courses, Ebooks & Guides, Software & Tools, Website Templates, Marketing & SEO, Graphics & Design, AI Tools, etc. — per Image 15's category list)
- Content review: platform reserves the right to reject listings that violate content policy (defined fully in Book 13 — Security/Trust & Safety)
- Digital products require instant-delivery file attachment; physical products require shipping/fulfillment info

---

## 4. Partner Center / Affiliate Flow

Any member (regardless of whether they are also a seller) can become a **promoter** for any listed product:

1. Browse marketplace or receive a product recommendation
2. Generate a unique affiliate link for that product
3. Share the link (via their website, storefront, social channels, CRM campaigns)
4. Earn the seller-set commission (§7) on any resulting sale, tracked via the link's referral code

**Functional Requirements (matches Image 14's Affiliate Settings / My Referrals):** click tracking, conversion tracking, commission history, withdrawal request.

---

## 5. Orders & Checkout

Standard e-commerce checkout (matches Image 15's cart/checkout flow): cart, order summary, payment method selection, order confirmation, digital delivery (instant download link) or physical fulfillment handoff.

**Business Rule:** An order is not considered "complete" for commission-triggering purposes (§7) until payment is confirmed by the payment processor — matching Book 0 §11's dual-condition rule for financial mutations.

---

## 6. Payments

Supports card, bank transfer, and DEOS Wallet balance (Book 2 Chapter 8) as payment methods at checkout. Refunds reverse the full commission chain (§7) via a documented reversing ledger entry — never by deleting the original transaction (Book 0 §14).

---

## 7. Commission & Fee Split Engine

This is the exact flow introduced in Book 0 §9, specified fully here.

**Inputs at time of listing (set by seller, within platform bounds):**
- Sale Price
- Promoter Commission Rate — seller-chosen, **10% minimum, 60% maximum** (Book 1 §6)

**Platform-defined constants:**
- Platform Transaction Fee Rate — recommended **10%** of sale price (per your original spec)
- Upline Override Rate — **confirmed at 3% of the promoter's commission** (founder decision; still subject to the Book 4 §11 sustainability simulator before production implementation)

**Split calculation, in order:**
```
1. Platform Fee        = Sale Price × Platform Fee Rate
2. Promoter Commission = Sale Price × Promoter Commission Rate   (only if a promoter link was used)
3. Upline Override     = Promoter Commission × Upline Override Rate   (only if promoter has a sponsor eligible per Book 4 qualification rules)
4. Seller Payout       = Sale Price − Platform Fee − Promoter Commission − Upline Override
```

**Business Rule (critical):** the Upline Override is paid **out of the promoter's commission pool**, not as an additional deduction from the seller — this must be explicit and disclosed to sellers at listing time, since it affects nothing about what the seller receives once Promoter Commission and Platform Fee are already fixed. This design choice keeps the seller's economics predictable regardless of whether their promoter happens to have an active upline.

**If no promoter is involved (direct marketplace sale, no affiliate link):** only the Platform Fee applies; Promoter Commission and Upline Override are both zero. Seller Payout = Sale Price − Platform Fee.

---

## 8. The Upline Override

This is your added mechanic from the earlier conversation — rewarding the promoter's sponsor when the promoter makes a sale, distinct from anything in Book 4's binary engine.

**Eligibility rule:** the promoter's **direct sponsor** (Book 4 §4 — sponsor tree, not placement tree) must be an active, qualifying member (Book 4 §12) to receive the override. **Confirmed by founder:** if the sponsor is inactive/unqualified, the 3% override is still deducted from the promoter's commission — it is not returned to the promoter — and routes instead to the Platform Sustainability Fund. This mirrors Book 4 §8 and §9's fallback logic exactly, so all three compensation mechanisms (Split Commission, Generation Bonus, Upline Override) behave identically when a recipient is unqualified. It is not skipped further up the chain unless a future version explicitly defines multi-level override support.

**Scope constraint (v1.0):** override applies to the promoter's **direct** sponsor only — one level. Multi-generation override (mirroring Book 4's Generation Bonus) is an open question for v1.1, not yet approved, since it compounds the same sustainability risk flagged in Book 4 §11 and needs its own simulator pass before being added.

---

## 9. Worked Examples

**Example A — Sale with promoter, sponsor active**
- Sale Price: $100
- Platform Fee Rate: 10% → $10
- Promoter Commission Rate (seller set): 40% → $40
- Upline Override Rate (confirmed): 3% of promoter commission → $1.20
- Promoter actually receives: $40 − $1.20 = $38.80
- Upline sponsor receives: $1.20
- Seller Payout: $100 − $10 − $40 = $50 *(override comes out of the $40, not an extra deduction from the seller)*

**Example B — Sale with promoter, sponsor inactive (confirmed rule)**
- Same as above: the $1.20 override is still deducted from the promoter's commission
- Promoter receives $38.80 (same as Example A — sponsor status does not change the promoter's take-home)
- The $1.20 routes to the Platform Sustainability Fund instead of the upline sponsor

**Example C — Direct marketplace sale, no promoter**
- Sale Price: $100, Platform Fee: $10, Seller Payout: $90

---

## 10. Storefronts

Matches Book 2 Chapter 13 (Partner Center). Every member can curate a branded storefront of marketplace products under their own website (Book 2 Chapter 9); sales through it are treated identically to affiliate-link sales for commission purposes (§7).

---

## 11. Reviews & Trust

Product reviews, ratings, and seller ratings (matches Image 15's star ratings and sales-count display) — full moderation and fraud-detection logic deferred to Book 13.

---

## 12. Coupons & Campaigns

Sellers can issue discount coupons; commission calculations (§7) apply to the **discounted** sale price, not list price, so promoter/override/fee amounts always reflect actual revenue collected.

---

## 13. Analytics

Seller-facing: revenue, top products, affiliate performance (matches Image 14). Promoter-facing: click/conversion/earnings (matches Image 14's Partner Center-equivalent view). Platform-facing: total marketplace GMV as % of platform revenue — this is the number Book 1 §14 tracks as a core success metric.

---

## 14. Database & Ledger Requirements

Per Book 0 §14 and consistent with Book 4 §15's pattern:
- `marketplace_orders` — order_id, buyer_id, seller_id, promoter_id (nullable), sale_price, status
- `commission_ledger` entries reused from Book 4, with two new event types added here: `platform_transaction_fee`, `promoter_commission`, `product_sale_upline_override`, `seller_payout`
- Every order's four possible ledger entries must sum to exactly the sale price — enforced as a database-level or application-level invariant check, not just a UI assumption

---

## 15. Acceptance Criteria

- [x] Upline Override Rate confirmed at 3% of promoter commission
- [x] Inactive-sponsor fallback confirmed — override still deducted, routes to Platform Fund, promoter's take-home unaffected by sponsor status
- [ ] Rate still subject to the Book 4 §11 compensation simulator for sustainability validation before production implementation
- [ ] Every completed order produces ledger entries summing exactly to sale price, with no rounding leakage (must define rounding rule — e.g., round down, remainder to platform fund; note $1.20 in Example A may need a defined decimal-precision standard for the ledger)
- [ ] Seller-facing disclosure clearly states, at listing time, that override is deducted from promoter commission, not added on top
- [ ] Legal review (Book 0 Appendix C) explicitly covers this override mechanic, not just the Book 4 binary engine — it is a distinct compensation feature and needs its own review line item
