# DEOS Product & Technical Architecture Master Guide
**Digital Entrepreneurship Operating System**
*The Authoritative, Unified Source of Truth for Books 0 through 15*

---

## Document Metadata & Governance
- **Version:** 2.0 (Comprehensive Multi-Tenant SaaS & Commerce Standard)
- **Classification:** Authoritative Technical Blueprint & Product Constitution
- **Scope:** Complete governance for Books 0–15, encompassing Multi-Tenant Architecture, Binary MLM, Public Marketplace, CRM, Email Automation, Dynamic Landing Pages, Model A Token Economy, Multi-Rail Payment Stack, and Progressive Dashboard States.
- **Binding Rule:** All software implementations, AI coding agents, database schemas, and API contracts must adhere strictly to the invariants documented herein.

---

## Executive Summary & System Philosophy

DEOS is **not** a traditional recruitment-focused network marketing system, nor is it a disparate collection of individual software licenses. It is a **centralized, enterprise-grade multi-tenant SaaS operating system** designed to give aspiring and professional digital entrepreneurs a complete, automated business infrastructure on day one.

### Core Invariants:
1. **One Central Multi-Tenant Platform:** One shared CRM infrastructure, one email marketing engine, one public marketplace, one wallet system, one AI studio, and one dynamic landing page engine. Entrepreneurs do not get separate hosting accounts or siloed installations; they receive isolated, branded, and permission-scoped workspaces on shared high-performance infrastructure.
2. **Real Digital Commerce Leg (Book 0 §5 & Book 5):** The ecosystem is designed around real digital and physical commerce. The public marketplace is open to unauthenticated visitors with guest checkout, and non-recruitment commercial revenue is constitutional.
3. **Model A Fixed-Value Token Standard (Book 10 §9):** DEOS Coin is strictly a fixed-value internal utility credit ($1.00 USD = 1.00 DEOS Coin) used for membership purchases, marketplace transactions, and platform services—never a speculative investment asset.
4. **Deterministic MLM Binary Engine (Book 4):** A pure mathematical compensation engine paying a flat 10% on weaker-leg Business Volume (BV) with perpetual carry-forward, structured direct bonuses ($25/$75/$125), and 30%/15% generation rewards.
5. **Progressive Dashboard States (Book 2):** User interfaces dynamically adapt to the member’s onboarding and activation state (`Registered`, `Wallet Not Funded`, `Membership Not Activated`, `Active Entrepreneur`).

---

## 1. Multi-Tenant SaaS Infrastructure & Data Isolation

```
                  ┌────────────────────────────────────────┐
                  │          Global Anycast Edge           │
                  │   Cloudflare / Fastly CDN + TLS 1.3    │
                  └───────────────────┬────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
   Custom Domain Traffic (DNS/CNAME)            Standard Web Traffic
   (e.g., johnsonagency.com)                    (app.deos.com / deos.com)
              │                                               │
              └───────────────────────┬───────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   Dynamic Routing Layer   │
                        │   (Host Header Resolver)  │
                        └─────────────┬─────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
   ┌────────────────────┐   ┌───────────────────┐   ┌────────────────────┐
   │ Dynamic Landing    │   │ Member Platform   │   │ Public Marketplace │
   │ Page Engine        │   │ Application Shell │   │ & Guest Checkout   │
   └──────────┬─────────┘   └─────────┬─────────┘   └──────────┬─────────┘
              │                       │                        │
              └───────────────────────┼────────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │    Centralized Multi-Tenant Core API   │
                  │   Auth · CRM · Email · Wallet · Binary │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │      Isolated PostgreSQL Database      │
                  │    Row-Level Security / Tenant Keys    │
                  └────────────────────────────────────────┘
```

### Architectural Principles:
* **Single Shared Application Stack:** A single deployment serves all members. There are no separate WordPress/cPanel hosting accounts, no individual CRM databases, and no disconnected email servers.
* **Tenant Isolation:** Every data entity (`Lead`, `Deal`, `MemberSite`, `LedgerTransaction`, `EmailCampaign`) contains a strict `member_id` foreign key. Row-Level Security (RLS) and API authorization middleware guarantee that entrepreneurs access only their own records.
* **Custom Domain CNAME Resolution:** Entrepreneurs point their custom domain DNS records (`CNAME` to `cname.deos.com` or `A` to `76.76.21.21`). The edge routing layer dynamically resolves the tenant profile and serves their customized landing page seamlessly with automatic SSL certificate provisioning.

---

## 2. Dynamic Landing Page Engine & Website Builder (Book 6)

### Default Experience: The Dynamic Entrepreneur Landing Page
Instead of forcing new members to build complex, multi-page websites before launching, the platform automatically provisions a **high-converting, single-page business landing page**:
1. **Dynamic Subdomain:** `username.deos.com` (provisioned immediately upon registration).
2. **Custom Domain Attachment:** Connect custom root domains or subdomains via 1-click DNS verification.
3. **Core Sections:**
   * **Hero Section:** Customizable headline, value proposition, and entrepreneur branding/avatar.
   * **Video Presentation Embed:** Integrated 4K masterclass or product explainer video player.
   * **Lead Capture & Contact Form:** Directly feeds leads into the entrepreneur's isolated CRM with immutable source attribution (`source = "personal_website"`).
   * **Embedded Member Registration Block (§4a):** Allows visitors to join DEOS directly from the entrepreneur's page, automatically binding the entrepreneur as the sponsor.
   * **Featured Marketplace Storefront Showcase:** Embeds live, purchasable digital products that visitors can purchase via Guest Checkout.
   * **Call to Action (CTA):** Configurable appointment booking, course enrollment, or affiliate offer links.

---

## 3. CRM & Email Marketing Automation Architecture (Book 7)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CENTRALIZED CRM & EMAIL ENGINE                        │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 1. Lead Ownership & Isolation        │ • Company owns infrastructure;       │
│                                      │   entrepreneur owns lead contacts.   │
│                                      │ • Permanent source attribution tags. │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ 2. Automated Email Sequences         │ • Pre-built welcome sequences.       │
│                                      │ • Product launch autoresponders.     │
│                                      │ • Downline onboarding sequences.     │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ 3. Email Swipe Copy Library          │ • Curated high-converting templates. │
│                                      │ • 1-click load into campaigns.       │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ 4. Personalization Engine            │ • Dynamic tags: {{first_name}},      │
│                                      │   {{sponsor_name}}, {{link}}.        │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ 5. Shared Deliverability Engine      │ • AWS SES / SendGrid multi-pool IP.  │
│                                      │ • Tenant-scoped quota enforcement.   │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Lead Ownership & Data Privacy:
* **Entrepreneur Ownership:** The member retains full ownership of their lead records, deal pipelines, and client lists. Data can be exported to CSV/JSON at any time.
* **Platform Security:** No member can access or view another member's leads, contacts, or email analytics.

---

## 4. Membership Resource Allocation Matrix

| Feature / Resource | Launch Tier ($100 / 100 DEOS) | Growth Tier ($300 / 300 DEOS) | Legacy Tier ($500 / 500 DEOS) |
|---|---|---|---|
| **One-Time Membership Fee** | 100 DEOS ($100 USD) | 300 DEOS ($300 USD) | 500 DEOS ($500 USD) |
| **Annual Renewal** | $50 / 50 DEOS per year | $50 / 50 DEOS per year | $50 / 50 DEOS per year |
| **Landing Pages & Sites** | 1 Active Landing Page | 3 Landing Pages + Site Builder | Unlimited Pages + Multi-Site |
| **Domain Connections** | Free Subdomain + Custom DNS | Subdomain + 1 Free Domain Voucher | Subdomain + 3 Custom Domains |
| **CRM Contact Capacity** | Up to 500 Contacts | Up to 5,000 Contacts | Unlimited Contacts |
| **CRM Deal Pipelines** | 1 Pipeline (5 Stages) | 3 Custom Pipelines | Unlimited Custom Pipelines |
| **Email Marketing Quota** | 1,000 sends / month | 10,000 sends / month | 50,000 sends / month |
| **Email Automation** | Basic Autoresponder | Full Multi-Step Sequences | Advanced Behavioral Workflows |
| **AI Business Center** | 50 AI Credits / month | 250 AI Credits / month | 1,000 AI Credits / month |
| **Direct Referral Bonus** | $25.00 | $75.00 | $125.00 |
| **Binary Commission Cap** | $1,000 / week | $5,000 / week | $25,000 / week |
| **Marketplace Listings** | Standard Seller (10% fee) | Priority Seller (10% fee) | Featured Seller + Fee Rebates |
| **Academy Access** | Starter Foundation Paths | Full Masterclasses & Certs | Exclusive Masterminds & VIP |
| **Support Level** | Standard Ticket Support | 24/7 Priority Chat | VIP Dedicated Account Manager |

---

## 5. Authoritative Onboarding & Registration Sequence

The platform enforces a progressive, high-converting onboarding sequence:

```
[ Public Landing Page / Member Site ]
                 │
                 ▼ (Lead Form)
[ Lead Captured & Sponsor Attributed ]
                 │
                 ▼
[ Registration & Account Creation ]
                 │
                 ▼
[ Member Login & Session Auth ]
                 │
                 ▼
[ Dedicated Wallet Auto-Provisioned ]
                 │
                 ▼
[ Wallet Funding (USDT TRC20 / Card / Bank) ]
                 │
                 ▼
[ Conversion to DEOS Coin (Model A: 1 USD = 1 DEOS) ]
                 │
                 ▼
[ Membership Plan Selection & Purchase in DEOS Coin ]
                 │
                 ▼
[ Platform Activation & Binary Tree Placement ]
                 │
                 ▼
[ Automated Business Environment Provisioning ]
  (Subdomain, Landing Page, CRM, Email & Academy)
                 │
                 ▼
[ Active Entrepreneur Dashboard ]
```

---

## 6. Progressive Dashboard States (Book 2)

To avoid overwhelming new users with locked tools, the user dashboard dynamically morphs across **4 progressive states**:

### State 1: Registered (Unfunded)
* **Visual State:** Focused onboarding screen with welcome greeting, embedded platform explainer video, and a prominent **"Fund Wallet & Activate"** action.
* **Gated Access:** Sidebar navigation to advanced tools (CRM, Email automation, AI center) displays a subtle lock indicator explaining activation is required.

### State 2: Wallet Funded (Unpurchased Plan)
* **Visual State:** Displays verified DEOS Coin balance with an interactive Plan Tier Comparison card (Launch, Growth, Legacy) and 1-click **"Activate Membership"** button.

### State 3: Membership Activated (Provisioning)
* **Visual State:** Displays the 15-step Business Launch Wizard checklist with automated domain provisioning and branding setup.

### State 4: Active Entrepreneur (Fully Unlocked)
* **Visual State:** Full operating dashboard featuring:
  * Real-time Earnings & Wallet Balance cards (in DEOS Coin).
  * 10% Binary Network Volume tracker with Left/Right leg volume and carry-forward stats.
  * CRM Funnel Pipeline and Lead Conversion metrics.
  * Business Website & Custom Domain live status.
  * Marketplace Promoter earnings and 1-click affiliate campaign links.
  * AI Assistant shortcuts and Academy course progress.

---

## 7. Model A Platform Utility Token Economy (Book 10 §9)

* **Designation:** `DEOS Coin` (Utility Credit Unit).
* **Valuation Model:** **Model A — Fixed-Value Utility Credit**.
  $$\text{1.00 DEOS Coin} = \$1.00 \text{ USD (Fixed)}$$
* **No Speculative Elements:** DEOS Coin does not float, trade on external secondary markets, or feature ticker price-fluctuation charts. It is presented purely as an internal stored-value utility balance.
* **Utility Use Cases:**
  1. Purchasing and upgrading membership plan tiers.
  2. Transacting in the Public Marketplace (buying digital courses, templates, AI tools).
  3. Funding AI Business Center credit top-ups.
  4. Redeeming domain registrations and renewals.
  5. Member-to-member internal transfers.

---

## 8. Public Marketplace & Multi-Rail Payment Stack (Book 5 & Book 10 v1.3)

### 8.1 Public Unauthenticated Access & Guest Checkout (Book 5 §4a)
* Non-members can browse the complete catalog at `/marketplace` or via promoter campaign links `deos.com/shop/<slug>?promo=<promoter_id>`.
* **Guest Checkout:** Buyers provide Name, Email, and Payment details without creating a password or selecting a membership tier. Digital products deliver instant license keys and email download links.

### 8.2 Commission & Fee Split Engine (Book 5 §7, §8, §8a)

#### Case A: Promoter Sale (via Affiliate / Campaign Link)
* **Platform Fee:** $10\%$ of Sale Price.
* **Promoter Commission:** $10\%$ to $60\%$ of Sale Price (set by seller).
* **Upline Override:** $3\%$ of the Promoter's commission pool (deducted from promoter take-home and paid to promoter's direct sponsor).
* **Seller Net Payout:** $\text{Sale Price} - \text{Platform Fee} - \text{Promoter Gross Commission}$.
* *Inactive Sponsor Fallback:* If the promoter's sponsor is inactive, the $3\%$ override routes to the Platform Sustainability Fund.

#### Case B: Direct Sale (No Promoter Involved — Book 5 §8a v1.2/1.3)
* **Total Direct Sale Fee:** $3\%$ (reduced from $10\%$).
  * **Platform Transaction Fee:** $2\%$ of Sale Price.
  * **Seller's Direct Upline Bonus:** $1\%$ of Sale Price (paid to seller's direct sponsor or Sustainability Fund).
  * **Seller Net Payout:** $97\%$ of Sale Price.

### 8.3 Payment Processor Stack (Book 10 §3b)
| Payment Rail | Underlying Processor | Target Market / Coverage | Settlement Speed |
|---|---|---|---|
| **Credit / Debit Cards (International)** | Stripe | Global / International Buyers | Instant |
| **Cards & Direct Bank Transfer (Africa)** | Paystack | Nigeria & West Africa Primary Market | Instant / 1–2 Hours |
| **Cryptocurrency (USDT TRC20)** | Direct Blockchain Node | Decentralized Global Deposits | Instant (1–3 block confirmations) |
| **Direct Bank Wire / EFT** | Paystack / Local Rails | Regional Business Accounts | 1–2 Business Hours |

---

## 9. Comprehensive Database Architecture (Book 12)

The PostgreSQL database enforces the canonical 14-event financial ledger, dual-tree MLM relationships, multi-tenant CRM, and marketplace orders:

```sql
-- Enums
CREATE TYPE "PlanTier" AS ENUM ('launch', 'growth', 'legacy');
CREATE TYPE "MemberRole" AS ENUM ('member', 'admin', 'super_admin', 'finance', 'support');
CREATE TYPE "MemberStatus" AS ENUM ('active', 'suspended', 'banned');
CREATE TYPE "LedgerEventType" AS ENUM (
  'direct_referral_bonus', 'binary_commission', 'generation_bonus',
  'split_commission_platform', 'split_commission_upline', 'platform_transaction_fee',
  'promoter_commission', 'product_sale_upline_override', 'direct_sale_upline_bonus',
  'seller_payout', 'academy_instructor_revenue', 'coin_deposit',
  'coin_conversion', 'wallet_withdrawal', 'wallet_transfer_in', 'wallet_transfer_out'
);
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'paid', 'refunded', 'disputed');
CREATE TYPE "KYCStatus" AS ENUM ('pending', 'approved', 'rejected');

-- Core Tables
CREATE TABLE "Member" (
    "id" TEXT PRIMARY KEY,
    "memberCode" TEXT UNIQUE NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "avatarUrl" TEXT,
    "plan" "PlanTier" NOT NULL DEFAULT 'growth',
    "role" "MemberRole" NOT NULL DEFAULT 'member',
    "status" "MemberStatus" NOT NULL DEFAULT 'active',
    "rank" TEXT NOT NULL DEFAULT 'Member',
    "sponsorId" TEXT,
    "placementParentId" TEXT,
    "placementLeg" TEXT,
    "walletBalance" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "usdtBalance" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "binaryLeftVolume" DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    "binaryRightVolume" DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3)
);

CREATE TABLE "LedgerTransaction" (
    "id" TEXT PRIMARY KEY,
    "memberId" TEXT NOT NULL REFERENCES "Member"("id"),
    "type" "LedgerEventType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'DEOS',
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
    "id" TEXT PRIMARY KEY,
    "slug" TEXT UNIQUE NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "affiliateCommissionRate" DECIMAL(4,2) NOT NULL DEFAULT 0.40,
    "sellerId" TEXT NOT NULL REFERENCES "Member"("id"),
    "imageUrl" TEXT NOT NULL,
    "digitalFileUrl" TEXT,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 5.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "MarketplaceOrder" (
    "id" TEXT PRIMARY KEY,
    "orderNumber" TEXT UNIQUE NOT NULL,
    "buyerMemberId" TEXT REFERENCES "Member"("id"),
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "promoterMemberId" TEXT REFERENCES "Member"("id"),
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "platformFee" DECIMAL(10,2) NOT NULL,
    "promoterCommission" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "uplineOverride" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "sellerPayout" DECIMAL(10,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentRail" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'paid',
    "licenseKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MemberSite" (
    "id" TEXT PRIMARY KEY,
    "memberId" TEXT UNIQUE NOT NULL REFERENCES "Member"("id"),
    "subdomain" TEXT UNIQUE NOT NULL,
    "customDomain" TEXT UNIQUE,
    "dnsStatus" TEXT NOT NULL DEFAULT 'active',
    "sslStatus" TEXT NOT NULL DEFAULT 'active',
    "contentSchema" JSONB,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Lead" (
    "id" TEXT PRIMARY KEY,
    "memberId" TEXT NOT NULL REFERENCES "Member"("id"),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "stage" TEXT NOT NULL DEFAULT 'Qualified',
    "dealValue" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
```

---

## 10. Centralized API Architecture (Book 11)

All member applications, landing page renderers, public storefronts, and admin portals consume standard RESTful endpoints:

* **Authentication & Identity:**
  * `POST /api/auth/register` (Captures sponsor code, generates unique member code, auto-provisions subdomain).
  * `POST /api/auth/login` (Returns signed JWT with role & tenant claims).
  * `GET /api/auth/me` (Returns member profile, active plan tier, and onboarding lifecycle state).
* **Wallet & Token System:**
  * `GET /api/wallet/balance` (Returns DEOS Coin, USDT, and locked balances).
  * `POST /api/wallet/deposit/quote` (Locks live 1:1 quote with 15-minute countdown).
  * `POST /api/wallet/transfer` (Internal peer-to-peer DEOS Coin transfer).
  * `POST /api/wallet/withdraw` (Requests fiat/USDT withdrawal subject to KYC).
* **MLM Binary & Referral Engine:**
  * `GET /api/binary/tree` (Returns tree nodes, left/right BV, and spillover status).
  * `GET /api/binary/commissions` (Returns direct bonuses, 10% binary calculations, and generation waterfall).
* **Public Marketplace & Guest Commerce:**
  * `GET /api/marketplace/products` (Public catalog with search, category filtering).
  * `GET /api/marketplace/products/:slug` (Unauthenticated single product details).
  * `POST /api/marketplace/guest-checkout` (Multi-rail guest checkout with instant split execution).
* **CRM & Email Automation:**
  * `POST /api/leads/capture` (Website contact form ingestion with permanent source tagging).
  * `GET /api/crm/deals` (5-stage drag-and-drop pipeline).
  * `POST /api/email/campaigns/send` (Queue broadcast campaign subject to tier limits).
* **Domain Integration & Edge DNS:**
  * `POST /api/domains/verify` (Checks live CNAME / A record DNS propagation).
  * `POST /api/domains/voucher/redeem` (Applies free domain voucher).

---

## 11. DevOps, Background Workers & Resilience (Book 14)

* **Asynchronous Queue Pipeline (BullMQ / Redis):**
  * `email-queue`: Processes transactional emails, welcome sequences, and marketing broadcasts.
  * `binary-settlement-queue`: Runs nightly binary volume calculations, carry-forward rollover, and generation splits.
  * `dns-ssl-queue`: Automatically requests and renews Let's Encrypt TLS 1.3 certificates for custom domains via ACME HTTP-01 challenges.
* **Append-Only Immutability:** Financial ledger entries and audit log records can never be updated (`UPDATE`) or deleted (`DELETE`); correcting mutations require equal-and-opposite reversing entries.
* **Disaster Recovery & Daily Backups:** Automated point-in-time PostgreSQL snapshots with 1-click restore capabilities.
