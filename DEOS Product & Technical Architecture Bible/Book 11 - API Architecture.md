# DEOS — Digital Entrepreneurship Operating System
## Book 11: API Architecture & Integration Contracts

**Version:** 2.0 (Multi-Tenant & Public Commerce Standard)
**Status:** Approved & Binding
**Governed by:** Book 0 (Constitution), Book 4 (Binary), Book 5 (Marketplace), Book 6 (Domains), Book 7 (CRM & Email), Book 10 (Wallet)

> This Book defines the RESTful API architecture, endpoint contracts, authorization headers, and webhook specifications for the DEOS ecosystem.

---

## Table of Contents

1. Architecture Overview & Base Standards
2. Authentication & Authorization Headers
3. Multi-Tenant Identity & Profile Endpoints
4. Wallet & DEOS Coin Engine Endpoints
5. Binary MLM & Commission Engine Endpoints
6. Public Marketplace & Guest Checkout Endpoints
7. Dynamic Landing Page & Domain DNS Endpoints
8. CRM & Lead Capture Endpoints
9. Email Marketing & Automation Endpoints
10. Webhook Integrations (Stripe, Paystack, TRC20 Node)
11. Rate Limiting & Security Policies
12. Acceptance Criteria

---

## 1. Architecture Overview & Base Standards

- **Base URL:** `https://api.deos.com/v1`
- **Protocol:** HTTPS with TLS 1.3
- **Format:** JSON (`Content-Type: application/json`)
- **Error Format:** RFC 7807 Standard Error Problem Details (`{ type, title, status, detail, instance }`)

---

## 2. Authentication & Authorization

All authenticated endpoints require a Bearer token in the `Authorization` header:
`Authorization: Bearer <jwt_token>`

JWT claims contain: `memberId`, `memberCode`, `role` (`member` | `admin` | `super_admin`), `plan` (`launch` | `growth` | `legacy`), and `tenantKey`.

---

## 3. Core API Endpoints

### 3.1 Authentication & Registration
- `POST /api/auth/register`
  - Body: `{ name, email, password, country, sponsorCode }`
  - Action: Creates member account, locks sponsor attribution, auto-provisions `username.deos.com` subdomain.
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, member: { id, memberCode, name, plan, rank, walletBalance } }`
- `GET /api/auth/me`
  - Response: Current member profile and onboarding lifecycle state (`registered`, `wallet_funded`, `activated`).

### 3.2 Wallet & DEOS Coin System (Book 10)
- `GET /api/wallet/balance`
  - Response: `{ deosBalance, usdtBalance, totalValuationUSD, availableBalance }`
- `POST /api/wallet/deposit/quote`
  - Body: `{ amountUSD, paymentMethod: "usdt" | "card" | "bank" }`
  - Response: `{ quoteId, deosAmount, rate: 1.00, expiresAt, depositAddress, clientSecret }`
- `POST /api/wallet/transfer`
  - Body: `{ recipientMemberCode, amountDEOS, note }`
- `POST /api/wallet/withdraw`
  - Body: `{ amountUSD, payoutMethod: "bank" | "usdt_trc20", destinationDetails }`

### 3.3 Public Marketplace & Guest Checkout (Book 5 v1.3)
- `GET /api/marketplace/products` (Public — No Auth Required)
  - Query: `?category=...&search=...&page=1`
- `GET /api/marketplace/products/:slug` (Public — No Auth Required)
- `POST /api/marketplace/guest-checkout` (Public — No Auth Required)
  - Body: `{ buyerName, buyerEmail, items: [{ id, price, affiliateCommissionRate }], promoterCode, paymentMethod }`
  - Response: `{ orderId, licenseKey, totalAmount, digitalDownloadUrl, splitBreakdown }`

### 3.4 Dynamic Landing Pages & Domains (Book 6)
- `GET /api/domains/check`
  - Query: `?domain=johnsonagency.com`
  - Response: `{ propagated: true, cnameTarget: "cname.deos.com", sslStatus: "active" }`
- `POST /api/domains/connect`
  - Body: `{ customDomain: "johnsonagency.com" }`
- `PUT /api/sites/landing-page`
  - Body: `{ templateId, brandColors, headline, bio, videoUrl, featuredProducts }`

### 3.5 CRM & Email Marketing (Book 7)
- `POST /api/leads/capture` (Public Endpoint for Landing Page Forms)
  - Body: `{ memberId, name, email, phone, source: "personal_website" }`
- `GET /api/crm/deals`
  - Response: Pipeline deals grouped by stage.
- `POST /api/email/campaigns/send`
  - Body: `{ subject, bodyHtml, recipientTag, sequenceId }`
  - Enforces tier sending quota limits.
