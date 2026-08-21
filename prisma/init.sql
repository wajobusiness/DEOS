-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('launch', 'growth', 'legacy');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('member', 'admin', 'super_admin', 'finance', 'support');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('active', 'suspended', 'banned');

-- CreateEnum
CREATE TYPE "LedgerEventType" AS ENUM ('direct_referral_bonus', 'binary_commission', 'generation_bonus', 'split_commission_platform', 'split_commission_upline', 'platform_transaction_fee', 'promoter_commission', 'product_sale_upline_override', 'direct_sale_upline_bonus', 'seller_payout', 'academy_instructor_revenue', 'coin_deposit', 'coin_conversion', 'wallet_withdrawal', 'wallet_transfer_in', 'wallet_transfer_out');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'paid', 'refunded', 'disputed');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "memberCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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
    "renewalDate" TIMESTAMP(3),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerTransaction" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" "LedgerEventType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'DEOS',
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "affiliateCommissionRate" DECIMAL(4,2) NOT NULL DEFAULT 0.40,
    "sellerId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "digitalFileUrl" TEXT,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 5.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "buyerMemberId" TEXT,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "promoterMemberId" TEXT,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "platformFee" DECIMAL(10,2) NOT NULL,
    "promoterCommission" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "uplineOverride" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "sellerPayout" DECIMAL(10,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentRail" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'paid',
    "licenseKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketplaceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "MarketplaceOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberSite" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "customDomain" TEXT,
    "dnsStatus" TEXT NOT NULL DEFAULT 'active',
    "sslStatus" TEXT NOT NULL DEFAULT 'active',
    "contentSchema" JSONB,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "stage" TEXT NOT NULL DEFAULT 'Qualified',
    "dealValue" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KYCVerification" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "status" "KYCStatus" NOT NULL DEFAULT 'pending',
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KYCVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "impactCategory" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_memberCode_key" ON "Member"("memberCode");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE INDEX "Member_sponsorId_idx" ON "Member"("sponsorId");

-- CreateIndex
CREATE INDEX "Member_placementParentId_idx" ON "Member"("placementParentId");

-- CreateIndex
CREATE INDEX "LedgerTransaction_memberId_idx" ON "LedgerTransaction"("memberId");

-- CreateIndex
CREATE INDEX "LedgerTransaction_type_idx" ON "LedgerTransaction"("type");

-- CreateIndex
CREATE INDEX "LedgerTransaction_createdAt_idx" ON "LedgerTransaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_sellerId_idx" ON "Product"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketplaceOrder_orderNumber_key" ON "MarketplaceOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "MarketplaceOrder_buyerEmail_idx" ON "MarketplaceOrder"("buyerEmail");

-- CreateIndex
CREATE INDEX "MarketplaceOrder_promoterMemberId_idx" ON "MarketplaceOrder"("promoterMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberSite_memberId_key" ON "MemberSite"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberSite_subdomain_key" ON "MemberSite"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "MemberSite_customDomain_key" ON "MemberSite"("customDomain");

-- CreateIndex
CREATE INDEX "Lead_memberId_idx" ON "Lead"("memberId");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- CreateIndex
CREATE UNIQUE INDEX "KYCVerification_memberId_key" ON "KYCVerification"("memberId");

-- CreateIndex
CREATE INDEX "AuditLog_impactCategory_idx" ON "AuditLog"("impactCategory");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "LedgerTransaction" ADD CONSTRAINT "LedgerTransaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceOrder" ADD CONSTRAINT "MarketplaceOrder_buyerMemberId_fkey" FOREIGN KEY ("buyerMemberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceOrder" ADD CONSTRAINT "MarketplaceOrder_promoterMemberId_fkey" FOREIGN KEY ("promoterMemberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceOrderItem" ADD CONSTRAINT "MarketplaceOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "MarketplaceOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceOrderItem" ADD CONSTRAINT "MarketplaceOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSite" ADD CONSTRAINT "MemberSite_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KYCVerification" ADD CONSTRAINT "KYCVerification_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

