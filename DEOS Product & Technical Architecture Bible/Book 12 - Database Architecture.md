# DEOS — Digital Entrepreneurship Operating System
## Book 12: Database Architecture & Canonical Data Model

**Version:** 2.0 (Multi-Tenant & Public Guest Commerce Schema Standard)
**Status:** Approved & Binding
**Governed by:** Book 0 (Constitution — §14 Database Standards is binding)

> This Book is the authoritative entity-relationship and schema reference for DEOS — consolidating tables, foreign keys, and indexes across all modules.

---

## Table of Contents

1. Purpose & Scope
2. Core Database Principles
3. Entity Domains Overview
4. Identity & Multi-Tenant Membership Tables
5. Binary MLM & Tree Topology Tables
6. Marketplace & Public Guest Orders Tables
7. Dynamic Landing Page & Domain Tables
8. CRM & Email Marketing Tables
9. Academy & Course Progress Tables
10. Wallet, DEOS Coin & Append-Only Financial Ledger
11. Admin, Security & Audit Tables
12. Indexing Strategy & Performance
13. Acceptance Criteria

---

## 1. Purpose & Scope

Defines the PostgreSQL schema for DEOS, enforcing tenant data isolation, append-only financial audit trails, and strict foreign key referential integrity.

---

## 2. Core Principles

- **Append-Only Financial Ledger:** Financial rows are never updated or deleted. Corrections are made via reversing ledger rows.
- **Tenant Key Enforcement:** Every tenant-owned row (`Lead`, `Deal`, `MemberSite`, `EmailCampaign`) contains a strict `member_id` foreign key.
- **Model A Currency Standard:** Values stored in standard `DECIMAL(12, 2)` format in DEOS Coin ($1.00 USD = 1.00 DEOS).

---

## 3. Canonical Schema Definitions

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum PlanTier {
  launch
  growth
  legacy
}

enum MemberRole {
  member
  admin
  super_admin
  finance
  support
}

enum MemberStatus {
  active
  suspended
  banned
}

enum LedgerEventType {
  direct_referral_bonus
  binary_commission
  generation_bonus
  split_commission_platform
  split_commission_upline
  platform_transaction_fee
  promoter_commission
  product_sale_upline_override
  direct_sale_upline_bonus
  seller_payout
  academy_instructor_revenue
  coin_deposit
  coin_conversion
  wallet_withdrawal
  wallet_transfer_in
  wallet_transfer_out
}

enum OrderStatus {
  pending
  paid
  refunded
  disputed
}

enum KYCStatus {
  pending
  approved
  rejected
}

model Member {
  id                  String         @id @default(cuid())
  memberCode          String         @unique
  name                String
  email               String         @unique
  passwordHash        String
  phone               String?
  country             String?
  avatarUrl           String?
  plan                PlanTier       @default(growth)
  role                MemberRole     @default(member)
  status              MemberStatus   @default(active)
  rank                String         @default("Member")

  sponsorId           String?
  placementParentId   String?
  placementLeg        String?

  walletBalance       Decimal        @default(0.00) @db.Decimal(12, 2)
  usdtBalance         Decimal        @default(0.00) @db.Decimal(12, 2)
  binaryLeftVolume    Decimal        @default(0.00) @db.Decimal(14, 2)
  binaryRightVolume   Decimal        @default(0.00) @db.Decimal(14, 2)

  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt
  renewalDate         DateTime?

  transactions        LedgerTransaction[]
  products            Product[]            @relation("SellerProducts")
  promoterOrders      MarketplaceOrder[]   @relation("PromoterOrders")
  memberOrders        MarketplaceOrder[]   @relation("MemberOrders")
  leads               Lead[]
  site                MemberSite?
  kyc                 KYCVerification?

  @@index([sponsorId])
  @@index([placementParentId])
}

model LedgerTransaction {
  id             String          @id @default(cuid())
  memberId       String
  member         Member          @relation(fields: [memberId], references: [id])
  type           LedgerEventType
  amount         Decimal         @db.Decimal(12, 2)
  currency       String          @default("DEOS")
  description    String
  status         String          @default("Completed")
  referenceId    String?

  createdAt      DateTime        @default(now())

  @@index([memberId])
  @@index([type])
  @@index([createdAt])
}

model Product {
  id                     String             @id @default(cuid())
  slug                   String             @unique
  title                  String
  category               String
  description            String             @db.Text
  price                  Decimal            @db.Decimal(10, 2)
  affiliateCommissionRate Decimal           @default(0.40) @db.Decimal(4, 2)
  sellerId               String
  seller                 Member             @relation("SellerProducts", fields: [sellerId], references: [id])
  imageUrl               String
  digitalFileUrl         String?
  salesCount             Int                @default(0)
  rating                 Decimal            @default(5.0) @db.Decimal(3, 2)
  isActive               Boolean            @default(true)

  createdAt              DateTime           @default(now())
  updatedAt              DateTime           @updatedAt
  orders                 MarketplaceOrderItem[]

  @@index([category])
  @@index([sellerId])
}

model MarketplaceOrder {
  id                     String                 @id @default(cuid())
  orderNumber            String                 @unique
  buyerMemberId          String?                // Nullable for Guest Checkout
  buyerMember            Member?                @relation("MemberOrders", fields: [buyerMemberId], references: [id])
  buyerName              String
  buyerEmail             String
  promoterMemberId       String?                // Referring affiliate ID
  promoterMember         Member?                @relation("PromoterOrders", fields: [promoterMemberId], references: [id])
  
  totalAmount            Decimal                @db.Decimal(10, 2)
  platformFee            Decimal                @db.Decimal(10, 2)
  promoterCommission     Decimal                @default(0.00) @db.Decimal(10, 2)
  uplineOverride         Decimal                @default(0.00) @db.Decimal(10, 2)
  sellerPayout           Decimal                @db.Decimal(10, 2)

  paymentMethod          String
  paymentRail            String
  status                 OrderStatus            @default(paid)
  licenseKey             String?

  createdAt              DateTime               @default(now())
  items                  MarketplaceOrderItem[]

  @@index([buyerEmail])
  @@index([promoterMemberId])
}

model MemberSite {
  id              String         @id @default(cuid())
  memberId        String         @unique
  member          Member         @relation(fields: [memberId], references: [id])
  subdomain       String         @unique
  customDomain    String?        @unique
  dnsStatus       String         @default("active")
  sslStatus       String         @default("active")
  contentSchema   Json?
  publishedAt     DateTime       @default(now())

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model Lead {
  id              String         @id @default(cuid())
  memberId        String
  member          Member         @relation(fields: [memberId], references: [id])
  name            String
  email           String
  phone           String?
  company         String?
  source          String         // IMMUTABLE
  status          String         @default("New")
  stage           String         @default("Qualified")
  dealValue       Decimal?       @db.Decimal(10, 2)

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([memberId])
  @@index([source])
}
```
