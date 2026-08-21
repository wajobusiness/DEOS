# DEOS — Digital Entrepreneurship Operating System
## Book 11: API Architecture

**Version:** 1.0
**Status:** Draft
**Governed by:** Book 0 (Constitution — §15 API Standards is binding), and every module Book (2–10), since this Book formalizes the interface layer beneath all of them

> This Book specifies the API surface every module Book has assumed exists — the interface the Website Builder, Mobile Apps (future), Admin Panel, and any third-party integrator all consume identically, per Book 0 §7's "API-first" principle.

---

## Table of Contents

1. Purpose & Scope
2. Design Principles
3. Authentication & Authorization
4. Versioning & Deprecation
5. Core Resource Domains
6. Financial Endpoint Requirements (Special Rules)
7. Webhooks & Event Bus
8. Rate Limiting
9. Error Handling
10. Third-Party Integrations
11. API Documentation Standard
12. Acceptance Criteria

---

## 1. Purpose & Scope

Every sub-app across Books 2–10 — Dashboard, CRM, Marketplace, Wallet, Academy, AI Center — is a client of the same underlying API, per Book 0 §7. This Book defines that API's shape, security model, and the special handling financial endpoints require, so implementation teams (human or AI) build one consistent interface rather than one per module.

---

## 2. Design Principles

- **REST-first**, JSON payloads, resource-oriented URLs (`/v1/members/{id}/wallet`, not verb-based endpoints).
- **One API, many consumers** — the member Dashboard, Admin Panel (Book 3), and any future mobile app all call the same endpoints; there is no "admin-only API" separate from the member API, only permission-scoped access to shared endpoints (enforced per Book 3 §15's role-permission requirement).
- **Idempotency by default** on any endpoint that creates a financial record — restated as binding from Book 0 §15.
- **Predictable pagination, filtering, and sorting** conventions applied uniformly across every list endpoint (leads, products, transactions, etc.).

---

## 3. Authentication & Authorization

**Functional Requirements:**
- Member-facing API: session/token-based auth (e.g., JWT or equivalent), tied to Book 2 Chapter 3's login/2FA flow.
- Admin-facing API calls: same token mechanism, plus role claims enforced server-side per Book 3 §2's role matrix — **restated as binding:** a Support-role token must be rejected at the API layer for a Finance-role action, not merely hidden in the UI (Book 3 §15's acceptance criterion, now given a concrete mechanism here).
- Third-party integrator access (future): OAuth2-style API keys scoped to specific resource permissions, never full account access by default.

---

## 4. Versioning & Deprecation

- All endpoints versioned from `/v1/` at launch (Book 0 §15).
- Breaking changes require a new version path (`/v2/`); non-breaking additions (new optional fields) may ship within a version.
- Deprecated endpoints remain functional for a defined notice period, with deprecation clearly signaled in response headers — this matters specifically because the Website Builder (Book 6) and any future integrator depend on API stability to keep member sites functioning.

---

## 5. Core Resource Domains

Mapped directly to the module Books, so any engineer or AI agent can find the right Book for a given endpoint's business rules:

| Domain | Endpoints (representative) | Governing Book |
|---|---|---|
| Identity | `/v1/auth`, `/v1/members/{id}` | Book 2 Ch. 2–3, 6 |
| Membership | `/v1/memberships`, `/v1/subscriptions` | Book 2 Ch. 7, 20; Book 1 §6 |
| Binary/Network | `/v1/network/tree`, `/v1/network/commissions` | Book 4 |
| Marketplace | `/v1/products`, `/v1/orders`, `/v1/affiliate-links` | Book 5 |
| Website | `/v1/sites`, `/v1/sites/{id}/domain` | Book 6 |
| CRM | `/v1/leads`, `/v1/deals`, `/v1/contacts` | Book 7 |
| Academy | `/v1/courses`, `/v1/enrollments` | Book 8 |
| AI Center | `/v1/ai/generate`, `/v1/ai/credits` | Book 9 |
| Wallet | `/v1/wallet`, `/v1/wallet/deposits`, `/v1/wallet/withdrawals` | Book 10 |
| Admin | `/v1/admin/*` (permission-scoped, not a separate API — §2) | Book 3 |

---

## 6. Financial Endpoint Requirements (Special Rules)

Every endpoint touching money (Wallet, Commission, Marketplace checkout, Coin deposit/conversion — Book 10 §3a) carries additional binding requirements beyond §2's general idempotency rule:

- **Dual-condition writes:** a commission or Coin-credit endpoint must verify the underlying payment/confirmation state server-side before writing a ledger entry — never trust a client-submitted "payment confirmed" flag alone (restated from Book 0 §11 and Book 10 §3a Step 5).
- **Every write produces exactly one typed ledger entry**, matching the event types already defined in Book 4 §15, Book 5 §14, Book 8 §10, Book 10 §11 — the API layer must not invent new untyped financial events.
- **Rate-lock enforcement:** the Coin deposit quote endpoint (Book 10 §3a Step 3) must enforce the same expiry window server-side that the UI countdown displays — the API is the source of truth for whether a quote is still valid, not the client clock.
- **Admin rate-change endpoints** (Book 10's admin-controlled Coin rate, and Book 3 §6's commission rate config) require the "confirm against current Book version" check to be enforced at the API layer, not just the admin UI — consistent with Book 3's acceptance criteria.

---

## 7. Webhooks & Event Bus

Per Book 0 §15 and Book 0 §9's Automation Engine dependency:

**Required webhook events (representative, not exhaustive):** `membership.purchased`, `product.sold`, `commission.generated`, `payout.processed`, `domain.provisioned`, `site.published`, `deposit.confirmed`, `coin.converted`, `lead.captured`.

**Functional Requirement:** the Automation Engine (Book 0 §9, used throughout Books 2–10 for triggered workflows like the Business Launch Wizard's step chain) subscribes to this same event bus — it is not a separate notification system layered on top, it *is* the primary consumer of these webhooks internally, in addition to any external integrator use.

---

## 8. Rate Limiting

**Functional Requirements:** per-member and per-API-key rate limits, scaled by plan tier where relevant (e.g., AI generation endpoints inherit Book 9 §3's credit system as its own natural throttle; general API calls get a separate technical rate limit to protect platform stability regardless of credit balance).

---

## 9. Error Handling

**Functional Requirements:** consistent error response shape across all endpoints (error code, human-readable message, field-level validation detail where applicable); financial endpoints in particular must return errors that are safe to display to a member without leaking internal system detail, while still being specific enough for support (Book 3 §11) to diagnose disputes quickly.

---

## 10. Third-Party Integrations

**Functional Requirements:** documented, versioned public API subset available to approved integrators (e.g., an accounting tool syncing marketplace sales, or a member's external CRM syncing leads) — scoped strictly to that integrator's approved permissions, logged identically to internal API calls for audit purposes (Book 0 §11).

---

## 11. API Documentation Standard

Per Book 0 §15: OpenAPI-format documentation generated/maintained alongside the API itself, so it can be validated automatically and consumed by AI coding agents building against it (Book 0 §16) without requiring a human to manually keep prose docs in sync with actual behavior.

---

## 12. Acceptance Criteria

- [ ] Every module's endpoints are permission-scoped from one shared API — no parallel "admin API" with different security assumptions
- [ ] All financial write endpoints enforce dual-condition verification and idempotency, with zero exceptions
- [ ] Coin deposit quote expiry (Book 10 §3a) is enforced server-side, matching the UI countdown exactly
- [ ] Webhook events fire reliably for every state change listed in §7, consumed correctly by the Automation Engine
- [ ] OpenAPI documentation stays in sync with actual endpoint behavior, validated as part of the release process (Book 0 §18 Version Control Standards)
