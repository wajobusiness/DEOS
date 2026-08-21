# DEOS — Digital Entrepreneurship Operating System
## Book 12: Database Architecture

**Version:** 1.0
**Status:** Draft
**Governed by:** Book 0 (Constitution — §14 Database Standards is binding), and consolidates every table reference scattered across Books 2–11

> This Book is the single entity-relationship reference for DEOS — every table any other Book mentioned in passing is defined here properly, with relationships, so no two modules invent conflicting schemas for the same concept.

---

## Table of Contents

1. Purpose & Scope
2. Core Principles (restated as binding)
3. Entity Domains Overview
4. Identity & Membership Tables
5. Binary/Network Tables
6. Marketplace Tables
7. Website Tables
8. CRM Tables
9. Academy Tables
10. AI Center Tables
11. Wallet & Coin Tables
12. Admin & Audit Tables
13. Cross-Cutting Ledger Design
14. Indexing & Performance Notes
15. Acceptance Criteria

---

## 1. Purpose & Scope

Books 4 through 11 each proposed tables relevant to their own module. This Book consolidates all of them into one coherent schema reference, resolves naming conflicts, and defines the relationships between domains explicitly — particularly where money or tree-structure data crosses module boundaries (e.g., a marketplace sale generating a binary-adjacent ledger entry).

---

## 2. Core Principles (restated as binding)

From Book 0 §14, binding on every table in this Book:
- **Financial and structural-history tables are append-only.** Corrections are new rows, never edits or deletes.
- Every table carries `created_at`, `updated_at`, and an `actor_id` or `system_process_id`.
- Naming: `snake_case` table and column names (Book 0 §13).

---

## 3. Entity Domains Overview

```
Identity ─┬─→ Membership ─┬─→ Binary/Network ──→ Commission Ledger ─┐
          │               │                                         │
          │               └─→ Marketplace ──→ Commission Ledger ────┼──→ Wallet
          │                                                          │
          ├─→ Website ──→ CRM Leads                                 │
          ├─→ Academy ──→ Instructor Revenue Ledger ─────────────────┤
          └─→ AI Center ──→ Credit Ledger                            │
                                                                       ▼
                                                              Treasury Fund Ledger
```

All ledger-producing domains (Binary/Network, Marketplace, Academy instructor revenue, AI credits) write into typed entries that ultimately surface in the member's Wallet (Book 10) — this Book's job is to make sure every domain's ledger entries share a compatible shape so Wallet, Reports (Book 2 Ch. 18), and Treasury (Book 3 §10) can aggregate across all of them without special-casing each domain.

---

## 4. Identity & Membership Tables

| Table | Key Columns | Notes |
|---|---|---|
| `members` | id, email, phone, country, plan_tier, status, created_at | Core identity record (Book 2 Ch. 2–3, 6) |
| `member_kyc` | member_id, verification_status, document_refs | Segregated access per Book 0 §11 (Book 10 §10) |
| `memberships` | id, member_id, plan, price_paid, bv_value, purchased_at | Append-only — a plan upgrade creates a new row, never edits the original purchase record (Book 3 §5) |
| `subscriptions` | id, member_id, renewal_status, renews_at, lapsed_at (nullable) | Book 2 Ch. 20 |

---

## 5. Binary/Network Tables

Consolidated from Book 4 §15:

| Table | Key Columns | Notes |
|---|---|---|
| `binary_tree_nodes` | member_id, sponsor_id, placement_parent_id, leg, depth | Sponsor tree and placement tree both represented (Book 4 §4) — `sponsor_id` and `placement_parent_id` are deliberately separate columns, never collapsed into one |
| `binary_volume_events` | member_id, bv_amount, source_transaction_id, period | Feeds weaker-leg calculation (Book 4 §10) |
| `site_referral_blocks` | site_id, member_id, referral_code | Book 6 §4a — links the embedded Join block to its owner's code |

---

## 6. Marketplace Tables

Consolidated from Book 5 §14:

| Table | Key Columns | Notes |
|---|---|---|
| `products` | id, seller_id, price, commission_rate, category, status | Book 5 §2–3; commission_rate constrained 10–60% at the application layer (Book 1 §6) |
| `marketplace_orders` | id, buyer_id, seller_id, promoter_id (nullable), sale_price, status | Book 5 §5 |
| `storefronts` | member_id, curated_product_ids | Book 5 §10 |

---

## 7. Website Tables

Consolidated from Book 6 §14:

| Table | Key Columns | Notes |
|---|---|---|
| `member_sites` | id, member_id, subdomain, custom_domain, dns_status, ssl_status, published_at | Book 6 §9 |
| `site_content` | site_id, version, content_json | Versioned/append-only, supports backup/restore (Book 6 §12) |
| `site_leads` | id, site_id, forwarded_to_crm_lead_id | Bridges to `crm_leads` (§8) |

---

## 8. CRM Tables

Consolidated from Book 7 §11:

| Table | Key Columns | Notes |
|---|---|---|
| `crm_leads` | id, member_id, source, status, created_at, converted_at | `source` immutable once set (Book 7 §2) |
| `crm_contacts`, `crm_companies` | standard relational fields | Book 7 §3 |
| `crm_deals` | id, contact_id, pipeline_stage, forecast_value | Explicitly does NOT trigger financial ledger entries (Book 7 §4) |
| `crm_interactions` | polymorphic: contact_id, type, content_ref, occurred_at | Book 7 §3 timeline |

---

## 9. Academy Tables

Consolidated from Book 8 §10:

| Table | Key Columns | Notes |
|---|---|---|
| `academy_courses`, `academy_lessons`, `academy_paths` | standard content hierarchy | Book 8 §2 |
| `academy_enrollments` | member_id, course_id, progress_percent, completed_at | Book 8 §6 — must reconcile exactly with Dashboard display |
| `academy_certificates` | member_id, certificate_id, issued_at, verification_code | Publicly verifiable per Book 8 §11 |
| `academy_instructor_revenue` | instructor_id, course_id, amount, event_type | Feeds Wallet like any other ledger domain (§13 below) |

---

## 10. AI Center Tables

Consolidated from Book 9 §9:

| Table | Key Columns | Notes |
|---|---|---|
| `ai_generations` | member_id, tool_type, credits_consumed, output_reference, created_at | Append-only (Book 9 §9) |
| `ai_credit_balances` | member_id, plan_allowance, consumed_this_period, purchased_topup | Book 9 §3 |

---

## 11. Wallet & Coin Tables

Consolidated from Book 10 §11 (v1.1, including the Coin deposit flow):

| Table | Key Columns | Notes |
|---|---|---|
| `wallet_balances` | member_id, fiat_equivalent_balance, coin_balance, available_balance | Book 10 §2 |
| `wallet_transactions` | member_id, type, amount, created_at | Append-only; `type` reuses the exact event names from §13 below — never a generic credit/debit |
| `coin_deposit_requests` | member_id, payment_method, fiat_amount, coin_amount_quoted, rate_locked, quote_expires_at, status | Book 10 §3a — full audit trail per deposit attempt |
| `coin_rate_history` | rate, set_by_admin_id, effective_at | Book 10 §9 — every admin rate change logged (rate is admin-controlled per founder decision) |
| `treasury_fund_ledger` | source_type, amount, source_reference | Separate from member wallets (Book 10 §8) |
| `kyc_records` | see `member_kyc` above | Segregated storage |

---

## 12. Admin & Audit Tables

| Table | Key Columns | Notes |
|---|---|---|
| `admin_roles`, `admin_permissions` | role_id, permission_key | Book 3 §2 role matrix, enforced at API layer per Book 11 §3 |
| `audit_log` | actor_id, action_type, resource_type, resource_id, before_state, after_state, created_at | Book 0 §11 / Book 3 §14 — covers every financial, commission-rate, and tree-placement change across all domains |

---

## 13. Cross-Cutting Ledger Design

This is the resolution to a risk visible across Books 4, 5, 8, and 10: each proposed its own ledger-ish table independently. To keep Wallet, Reports, and Treasury able to aggregate cleanly, **all financial event types across every domain share one canonical enum**, stored consistently wherever a ledger entry is written (whether that's `wallet_transactions.type`, or a domain-specific table's `event_type` column):

```
direct_referral_bonus | binary_commission | generation_bonus |
split_commission_platform | split_commission_upline |
platform_transaction_fee | promoter_commission | product_sale_upline_override | seller_payout |
academy_instructor_revenue |
coin_deposit | coin_conversion | wallet_withdrawal | wallet_transfer_in | wallet_transfer_out
```

**Business Rule:** No new financial event type may be introduced by an individual module's implementation team without being added to this canonical list first — this is what prevents Book 10's Wallet from ever showing an "Other" bucket that can't be explained (Book 0 §10 transparency requirement, now enforced at the schema level).

---

## 14. Indexing & Performance Notes

- `binary_tree_nodes` requires an indexed structure suited to deep-tree traversal (nested-set or closure-table model, per Book 4 §3) — naive recursive queries will not scale to the tree sizes implied by the mockups (hundreds of nodes per member already at moderate adoption).
- All `*_ledger` and `*_transactions` tables are append-only and should be indexed on `member_id` + `created_at` for fast Wallet/Reports queries, and partitioned by time period once volume warrants it.
- `crm_leads.source` and `site_leads` should be indexed together to keep Book 7 §10's lead-source analytics fast even as lead volume grows.

---

## 15. Acceptance Criteria

- [ ] Every table referenced in Books 4–11 has exactly one authoritative definition in this Book — no module implements a conflicting schema for the same concept
- [ ] All financial event types across every domain draw from the single canonical enum in §13
- [ ] Sponsor tree and placement tree remain structurally distinct in `binary_tree_nodes`, never collapsed
- [ ] `crm_deals` cannot, by schema design, generate a `wallet_transactions` entry directly — only real Marketplace/Binary/Academy events can
- [ ] Tree traversal queries perform acceptably at realistic scale (tested against a simulated tree of at least tens of thousands of nodes, per Book 4 §3)
