# Eviona Ecosystem — Digital Entrepreneurship Operating System
## Book 19: Payment Gateway Engine

**Version:** 1.0  
**Status:** Approved & Binding  
**Governed by:** Book 0 (Constitution & §14 Ledger Immutability), Book 1 (Business Blueprint), Book 4 (Binary Compensation), Book 5 (Marketplace), Book 10 (Wallet & Token Standard), Book 13 (Security)  

---

## 1. Overview & Architectural Isolation

The **Payment Gateway Engine** is the single, centralized financial entry and exit portal for the entire Eviona Ecosystem. It manages multi-rail payment integrations, validates transaction authenticity, executes cryptographically verified webhook processing, credits user balances, facilitates fiat-to-token conversions, records immutable double-entry ledger transactions, and broadcasts payment lifecycle events across all platform sub-modules.

### The Decoupling Principle:
**No platform module (Membership, Marketplace, Academy, AI, CRM) may communicate directly with external payment providers (Stripe, Paystack, Kuda, TRON nodes).** Every financial operation must route strictly through the centralized Payment Gateway Engine.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CENTRALIZED PAYMENT ENGINE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ User / Buyer ]                                                           │
│         │                                                                   │
│         ▼                                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    PAYMENT GATEWAY ENGINE LAYER                       │  │
│  │  Multi-Rail Router · Signature Verification · Replay Protection       │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     PAYMENT PROVIDER ADAPTERS                         │  │
│  │  Paystack · Kuda Business API · Direct Crypto (TRC20) · Bank Rails    │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    CANONICAL FINANCIAL ENGINE                         │  │
│  │  Double-Entry Wallet Ledger · Model A Utility Token Conversion (EVO)  │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                EVENT DISPATCHER (LOOSELY COUPLED)                     │  │
│  │  Membership Activated · Marketplace Paid · Course Unlocked · AI Credit│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Rail Provider Integrations

The engine standardizes diverse local and international payment rails under a unified operational API:

| Gateway / Rail | Integration Modality | Target Region / Asset | Core Capabilities |
| :--- | :--- | :--- | :--- |
| **Paystack** | Multi-Rail API + Webhook | Africa / Regional Global | Card processing, Bank transfers, Virtual accounts, USSD, Apple Pay |
| **Kuda Business API** | REST API + Instant Webhooks | Direct Banking Rails | Real-time bank transfer confirmation, virtual account generation, automated payouts, reconciliation |
| **Direct Blockchain (TRON/EVM)** | RPC Node / Webhook Scanner | Global Crypto | USDT (TRC20/ERC20/BEP20), BTC, ETH direct deposit address generation, block verification |
| **Direct Bank Wire / EFT** | Hybrid Manual & Virtual Accounts | Global Fiat | Automated matching via unique reference codes or admin confirmation desk |
| **Stripe (Global Expansion)** | Elements + Webhooks | International (US/EU/APAC) | Cards, Apple Pay, Google Pay, ACH, SEPA, multi-currency conversion |

---

## 3. End-to-End Payment Processing Flow

```
[ 1. User Initiates Payment (Plan / Product / Deposit) ]
                         │
                         ▼
[ 2. Payment Gateway Engine Ingests Intent & Selects Optimal Rail ]
                         │
                         ▼
[ 3. Provider Processes Transaction & Emits Cryptographically Signed Webhook ]
                         │
                         ▼
[ 4. Webhook Ingestion Layer: Validates Signature & Idempotency Key ]
                         │
                         ▼
[ 5. Financial Engine: Credits Wallet Balance & Converts to EVO Token ]
                         │
                         ▼
[ 6. Immutable Financial Ledger: Records Append-Only Transaction ]
                         │
                         ▼
[ 7. Internal Event Dispatcher Broadcasts "payment.success" ]
     ├──► Membership Module: Upgrades User Tier & Triggers Binary Volume
     ├──► Marketplace Module: Releases Digital License Key & Splits Commission
     ├──► Academy Module: Grants Immediate Course Enrollment
     ├──► AI Center: Allocates Compute / Generation Credits
     └──► Notification Service: Dispatches In-App & Email Confirmation
```

---

## 4. Provider Abstraction Interface

Every payment adapter implements a standardized programmatic contract:

```typescript
export interface PaymentProviderAdapter {
  createPayment(params: CreatePaymentDTO): Promise<PaymentResponse>;
  verifyPayment(reference: string): Promise<VerificationResult>;
  handleWebhook(rawBody: string, signature: string): Promise<WebhookEvent>;
  processRefund(paymentId: string, amount: number): Promise<RefundResult>;
  checkPaymentStatus(paymentId: string): Promise<PaymentStatus>;
}
```

---

## 5. Automated Wallet Funding & Token Conversion

* **Fixed Valuation Standard (Model A):** All incoming fiat currencies are converted into EVO Tokens at the system canonical rate ($1.00\text{ USD} = 1.00\text{ EVO}$) for utility consumption.
* **Idempotent Processing:** Webhooks and transaction confirmations execute under distributed locks with unique reference IDs to eliminate double-crediting vulnerabilities.

---

## 6. Comprehensive Withdrawal Engine

Entrepreneurs can withdraw earned commissions to verified bank accounts or external cryptocurrency addresses:

```
[ Withdrawal Request Submitted ]
               │
               ▼
[ Compliance & Anti-Fraud Verification (KYC + 2FA) ]
               │
               ▼
[ Ledger Balance Validation & Escrow Hold ]
               │
               ▼
[ Super Admin Approval Rules (Instant for Tier 1 / Manual for Tier 2) ]
               │
               ▼
[ Payment Gateway Adapter Executes Outbound Rail (Kuda API / Paystack Transfer / TRC20 Dispatch) ]
               │
               ▼
[ Bank / Blockchain Confirmation & Ledger Closure ]
```

---

## 7. Super Admin Payment Center

Controlled exclusively by authorized platform administrators at `/backoffice`:

* **Gateway Configuration:** Enable/disable providers, sandbox/live toggle, API key rotation, webhook endpoint testing.
* **Monetary Parameter Policies:** Minimum deposit thresholds, maximum withdrawal caps, processing fee structures, network gas subsidies.
* **Token Configuration:** Base exchange rates, supported deposit currencies, conversion margin buffers.
* **Real-time Financial Surveillance:** Live stream of successful charges, pending settlements, failed attempts, dispute/chargeback alerts, and automated liquidity health metrics.

---

## 8. Database Schema Specifications

```sql
-- 1. Configured Payment Gateways
CREATE TABLE "payment_gateways" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL, -- paystack, kuda, stripe, crypto_trc20, bank_transfer
    "status" TEXT NOT NULL DEFAULT 'active',
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "configuration" JSONB NOT NULL, -- Encrypted credentials, webhook keys, public keys
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- 2. Transaction Records
CREATE TABLE "payments" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "Member"("id"),
    "gateway_id" TEXT NOT NULL REFERENCES "payment_gateways"("id"),
    "amount" DECIMAL(12, 2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
    "reference" TEXT UNIQUE NOT NULL,
    "verified_at" TIMESTAMP(3),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- 3. Webhook Audit Stream
CREATE TABLE "webhooks" (
    "id" TEXT PRIMARY KEY,
    "gateway" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "signature" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Outbound Payout Ledger
CREATE TABLE "payouts" (
    "id" TEXT PRIMARY KEY,
    "user_id" TEXT NOT NULL REFERENCES "Member"("id"),
    "amount" DECIMAL(12, 2) NOT NULL,
    "destination" JSONB NOT NULL, -- Account number, bank code, or crypto wallet
    "gateway_id" TEXT NOT NULL REFERENCES "payment_gateways"("id"),
    "status" TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, rejected
    "reference" TEXT UNIQUE NOT NULL,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. Security Invariants & Cryptographic Defense

1. **HMAC Signature Validation:** Every incoming webhook is rejected immediately if the HMAC SHA-256 / SHA-512 signature does not reconcile with the provider secret.
2. **Replay & Timestamp Defense:** Requests with timestamp drifts exceeding 300 seconds or previously consumed idempotency keys are dropped.
3. **Encrypted Vault Storage:** All API private keys, secret keys, and webhook signing secrets are stored using AES-256 encryption at rest.
4. **Append-Only Immutability:** Payment logs and ledger transactions can never be modified or removed by any user or administrator.
