# DEOS — Digital Entrepreneurship Operating System
## Book 5: Marketplace & Public Digital Commerce

**Version:** 1.3 (Public Access, Guest Checkout & Direct Sale 3% Split Standard)
**Status:** Approved & Binding
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 4 (Binary Engine — cross-referenced), Book 10 (Payment Rails)

> This Book defines the marketplace: how products are listed, sold, promoted, and how revenue splits between platform, seller, promoter, and upline sponsors. This is the commerce leg that must carry real weight alongside the binary network.

---

## Table of Contents

1. Purpose & Scope
2. Seller Center & Listing Management
3. Product Listing Rules & Taxonomy
4. Partner Center & Affiliate Promotion
   * 4a. Guest Checkout & Public Marketplace Access (v1.3)
5. Orders & Checkout Experience
6. Payment Processor Stack Integration (Book 10 §3b)
7. Commission & Fee Split Engine
8. The Upline Override
   * 8a. Direct-Sale Seller Upline Bonus (v1.2/1.3)
9. Worked Mathematical Examples
10. Member Storefronts & Website Embeds
11. Reviews, Ratings & Trust & Safety
12. Campaigns & Promotional Links
13. Marketplace Analytics
14. Database & Ledger Requirements
15. Acceptance Criteria

---

## 1. Purpose & Scope

The Marketplace is where members list and sell digital products, courses, templates, and AI tools, and where other members promote those listings for high-yielding affiliate commissions. Non-members can freely browse and buy without logging in or registering.

---

## 2. Seller Center & Listing Management

Any member can become a seller by listing their first product:
- Product creation: Title, slug, description, category, pricing in DEOS Coin, and digital file upload.
- Affiliate Commission Rate Setter: Seller chooses a promoter commission between **10% minimum and 60% maximum**.
- Seller Sales Dashboard: Gross revenue, units sold, affiliate-driven sales, and net pending payout (in DEOS Coin).

---

## 3. Product Listing Rules & Taxonomy

Fixed category taxonomy:
- Digital Courses & Masterclasses
- Ebooks & Playbooks
- Software & Web Tools
- Website Templates & UI Kits
- Marketing & Sales Funnels
- Graphics & Design Assets
- AI Prompts & Agents

---

## 4. Partner Center & Affiliate Promotion

Any member can generate unique affiliate campaign links for any listed product:
`https://deos.com/shop/<product-slug>?promo=<promoter_member_code>`

### 4a. Guest Checkout & Public Marketplace Access (v1.3)
The Marketplace is **not login-gated**. Anyone — a public visitor arriving from Google, Facebook, Instagram, or an entrepreneur's link — can browse and buy products without creating an account.

**Functional Requirements:**
- **Public Product Pages:** Reachable at `deos.com/shop/<product-slug>`.
- **Landing Page Featured Showcase:** Surfaces live, purchasable products directly on the public homepage.
- **Guest Checkout Flow:** Collects Buyer Name, Email (for instant digital product delivery), and Payment Method (Credit Card, Paystack Bank Transfer, USDT TRC20) — no password or plan selection required.
- **Instant Digital Delivery:** Emits a unique verified digital license key and email download link.
- **Attribution & Settlement:** The captured promoter code is credited with full affiliate commission and 3% upline override payout regardless of whether the buyer is a guest or member.

---

## 5. Orders & Checkout Experience

Standard e-commerce checkout supporting:
1. **Logged-In Members:** Pay using internal DEOS Coin wallet balance, Card, or USDT.
2. **Public Guests:** Pay using Credit Card (Stripe/Paystack), Bank Transfer (Paystack), or USDT TRC20.

---

## 6. Payment Processor Stack Integration

Runs on the confirmed 4-rail payment processor stack defined in Book 10 §3b:
- **Stripe:** International card checkouts.
- **Paystack:** Nigeria / Africa card payments and direct EFT bank transfers.
- **Direct Crypto (USDT TRC20):** Blockchain settlement.
- **DEOS Wallet:** Internal member-to-member zero-fee settlement.

---

## 7. Commission & Fee Split Engine

### Case A: Promoter Sale (via Affiliate / Campaign Link)
$$\text{Platform Fee} = \text{Sale Price} \times 10\%$$
$$\text{Promoter Commission (Gross)} = \text{Sale Price} \times \text{Promoter Rate (10\%–60\%)}$$
$$\text{Upline Override} = \text{Promoter Commission (Gross)} \times 3\%$$
$$\text{Promoter Net Take-Home} = \text{Promoter Commission (Gross)} - \text{Upline Override}$$
$$\text{Seller Net Payout} = \text{Sale Price} - \text{Platform Fee} - \text{Promoter Commission (Gross)}$$

*Rule:* The 3% Upline Override is paid out of the promoter's commission pool, keeping the seller's economics 100% predictable.

---

## 8. The Upline Override & Direct Sale Bonus

### 8a. Direct-Sale Seller Upline Bonus (Book 5 §8a v1.2/1.3)
When a seller makes a direct sale without an affiliate/promoter link, the total fee is reduced from 10% to **3% total**:

$$\text{Platform Transaction Fee} = \text{Sale Price} \times 2\%$$
$$\text{Seller's Direct Upline Bonus} = \text{Sale Price} \times 1\% \quad (\text{Ledger Event: } \texttt{direct\_sale\_upline\_bonus})$$
$$\text{Seller Net Payout} = \text{Sale Price} \times 97\%$$

*Inactive Sponsor Fallback:* If the seller's direct sponsor is inactive, the 1% bonus routes to the Platform Sustainability Fund.

---

## 9. Worked Mathematical Examples

### Example 1: $100 Digital Course (40% Promoter Commission)
- Sale Price: **$100.00 DEOS**
- Platform Fee (10%): **$10.00 DEOS**
- Promoter Gross Commission (40%): **$40.00 DEOS**
  - Upline Override (3% of $40): **$1.20 DEOS** (paid to promoter's sponsor)
  - Promoter Net Take-Home: **$38.80 DEOS**
- Seller Net Payout: **$50.00 DEOS**
- Total Check: $\$10.00 + \$1.20 + \$38.80 + \$50.00 = \$100.00$.

### Example 2: $100 Digital Course (Direct Sale, No Promoter)
- Sale Price: **$100.00 DEOS**
- Total Fee (3%): **$3.00 DEOS**
  - Platform Fee (2%): **$2.00 DEOS**
  - Seller's Sponsor Bonus (1%): **$1.00 DEOS**
- Seller Net Payout (97%): **$97.00 DEOS**
- Total Check: $\$2.00 + \$1.00 + \$97.00 = \$100.00$.
