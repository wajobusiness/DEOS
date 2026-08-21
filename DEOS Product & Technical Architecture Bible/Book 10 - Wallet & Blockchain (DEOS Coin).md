# DEOS — Digital Entrepreneurship Operating System
## Book 10: Wallet & Blockchain

**Version:** 1.1 — DEOS Coin deposit/conversion system specified in detail per founder-provided mockup (v1.0's deferral of the token layer is superseded for the Deposit/Coin mechanic specifically; see §9 change log below)
**Status:** Draft — DEOS Coin mechanics fully specified; **not cleared for production/real-money implementation until Book 0 Appendix C legal review is extended to explicitly cover it (see §9)**
**Governed by:** Book 0 (Constitution — §11 Security, §14 Database Standards are binding), Book 4 (Binary Engine — ledger event types), Book 5 (Marketplace — ledger event types), Book 2 (User Platform — Chapter 8 summarized this module; this Book details it fully)

**v1.1 change log:**
- §9 rewritten: DEOS Coin is now specified as a near-term deposit/conversion mechanism (not deferred), per founder direction and the deposit-flow mockup provided
- New §3a (Deposit Flow) added, detailing the full 6-step deposit UI and multi-method payment support (USDT TRC20, Bank Transfer, Credit/Debit Card, Other Crypto, Mobile Money)
- The legal-review gate from v1.0 is **retained and widened**, not removed — see §9's updated rationale

> This Book specifies the Wallet (near-term, required for launch) and the Token/Blockchain layer (long-term, explicitly deferred). Matches Image 17.

---

## Table of Contents

1. Purpose & Scope
2. Wallet Overview
3. Deposits
3a. Deposit Flow & DEOS Coin Conversion
4. Withdrawals
5. Internal Transfers
6. Convert (Coin ↔ Fiat)
7. Earnings Summary & Wallet Allocation
8. Treasury & Platform Sustainability Fund
9. DEOS Coin — Platform Currency
10. KYC & Withdrawal Security
11. Database Requirements
12. Acceptance Criteria

---

## 1. Purpose & Scope

The Wallet is where every earning type defined across Books 4, 5, 8, and 9 lands and becomes usable — withdrawable, transferable, or convertible. This Book is intentionally split into near-term (Wallet, fiat/stablecoin handling) and long-term (native Token, smart contracts) sections, because Book 1 §12's roadmap explicitly defers the token layer until the core platform is stable and the compensation model is legally cleared — building blockchain infrastructure before that gate is met would be building on an unconfirmed foundation.

---

## 2. Wallet Overview

Matches Image 17 exactly.

**Functional Requirements:** Total Wallet Balance, DEOS Token Balance (deferred component, §9), USDT/fiat Balance, Available Balance; Wallet Balance Overview chart (30/60/90-day trend); Earnings Summary broken out by source (Binary Bonus, Partner Commission, Marketplace Earnings, Generation Bonus, Other); Wallet Allocation donut.

**Business Rule (restated from Book 2 Chapter 8, binding here):** every figure shown must trace to a specific, typed ledger entry from Book 4 §15 or Book 5 §14 — no aggregated "Other" figure without an underlying itemizable source.

---

## 3. Deposits

**Functional Requirements:** fund the wallet via card, bank transfer, or (once available) stablecoin deposit — used to buy AI credits (Book 9 §3), upgrade membership (Book 2 Chapter 7), or fund marketplace purchases (Book 5 §6) directly from wallet balance rather than re-entering payment details each time.

---

## 3a. Deposit Flow & DEOS Coin Conversion (matches founder-provided mockup in full)

**Executive Summary:** Every deposit, regardless of payment method, is converted automatically into DEOS Coin at the live platform-set rate — the member never holds a raw fiat balance mid-transaction; they hold Coin, which is what's spent everywhere else on the platform (membership purchases, marketplace checkout, AI credit top-ups, services).

**Step 1 — Choose Method:**
- Payment methods offered: USDT (TRC20) — Instant; Bank Transfer — 1–2 Hours; Credit/Debit Card — Instant; Other Crypto — Varies; Mobile Money — Instant
- Each method displays its processing-time expectation directly on the selection card, set truthfully per method (crypto/card instant, bank transfer realistically 1–2 hours) — never implying instant settlement for a method that isn't.

**Step 2 — Enter Amount:**
- "You Pay" field (amount + currency selector, e.g., USD)
- "You Receive (Estimated)" — live-calculated DEOS Coin amount at current rate, with a refresh/re-quote control (matches the mockup's rate refresh icon) since the rate can move between quote and confirmation
- Minimum/maximum deposit limits shown (e.g., Min $10 / Max $10,000 per the mockup) — enforced server-side, not just as a UI hint

**Step 3 — Confirm Details:**
- Full summary: Payment Method, You Pay, You Receive (Estimated), Rate, Network (for crypto — e.g., TRC20), Network Fee, Total
- **Business Rule:** the rate locks at the moment "Confirm & Proceed" is pressed, not at final settlement — the member is protected from the rate moving against them between confirmation and actual payment receipt, within a defined quote-validity window (matches the mockup's visible countdown timer, e.g., "14:59")

**Step 4 — Send Payment:**
- For crypto (USDT TRC20): unique deposit address + QR code displayed, copy-to-clipboard for the address, explicit warning to send only the specified asset/network (matches mockup: "Only send USDT (TRC20) to this address") — sending the wrong asset or network is a common real-world loss vector and must be warned against prominently, not buried in fine print
- For card/bank transfer: standard payment processor redirect/embedded flow
- Countdown timer showing time remaining on the locked quote (§3, Step 3)

**Step 5 — Payment Received:**
- Real-time payment detection (blockchain confirmation for crypto, processor webhook for card/bank) — matches mockup's "Payment Confirmed! Converting to DEOS coin..." state
- **Business Rule:** Coin is only credited after payment is confirmed by the underlying processor/network — never optimistically credited on "I have sent the payment" alone (the mockup's manual confirmation button is a UX nudge for the member, not the actual trigger for crediting funds)

**Step 6 — Deposit Successful:**
- Confirmation screen showing Coin amount added, new wallet balance, and fiat-equivalent value at time of deposit
- Deposit is logged as a typed ledger event (§11) immediately

**Trust & Transparency Elements (matches mockup's footer badges):** Secure Transactions (bank-level encryption messaging, backed by actual Book 0 §11 security practices, not just marketing copy), Instant Conversion, Best Rates, 24/7 Support — each of these claims must be true of the actual implementation, not aspirational copy, per Book 0 §4's Transparency value.

**Live Rate Display:** DEOS Coin price and % change shown persistently in the wallet header (matches mockup's "$1.25 +4.35%" ticker) — see §9 for how this rate is actually determined and the regulatory weight that display choice carries.

---

## 4. Withdrawals

**Functional Requirements:** request withdrawal to bank account or supported payout method; matches Image 14's "Available Balance / Request Payout" pattern and Image 17's Withdraw action; minimum withdrawal threshold, processing time disclosed before request confirmation.

**Business Rule:** Withdrawal requests above a platform-defined threshold require KYC verification (§10) before release — Finance-role admin approval required (Book 3 §2, §10), consistent with the separation-of-duties rule established there.

---

## 5. Internal Transfers

**Functional Requirements:** send balance to another DEOS member's wallet (matches Image 17's "Transfer" action) — useful for, e.g., a seller paying a collaborator, or a member gifting credit. Transfers are logged distinctly from earnings (a transfer-in is never confused with a commission event in reporting).

---

## 6. Convert (Coin ↔ Fiat)

**Functional Requirements:** matches Image 17's Convert action and Recent Conversions panel — allows a member to convert between their Coin balance and fiat-equivalent tracking within the wallet. **Whether Coin can ever be converted back to withdrawable fiat (as opposed to being spend-only within the platform) is one of the open decisions in §9 and must be resolved before this section's UI is finalized** — a spend-only Coin and a freely convertible Coin carry very different regulatory weight.

---

## 7. Earnings Summary & Wallet Allocation

**Functional Requirements:** breakdown by source exactly matching Image 17's Earnings Summary card (Binary Bonus, Partner Commission, Marketplace Earnings, Generation Bonus, Other) and Wallet Allocation donut (currency/asset split of current balance). Rolls up into the member's main Dashboard (Book 2 Chapter 5) and Reports (Book 2 Chapter 18).

---

## 8. Treasury & Platform Sustainability Fund

**Functional Requirements (admin-facing, cross-referenced from Book 3 §10):** platform-side view of the Fund's inflows — Split Commission fallback (Book 4 §8), unqualified Generation Bonus fallback (Book 4 §9), and Upline Override fallback (Book 5 §8) — and its use for operational sustainability per Book 1 §7.3's allocation model.

**Business Rule:** The Fund is not a member-facing balance — it belongs to platform operations, not to any individual member, and must be clearly separated in the data model from member wallet balances to avoid any ambiguity in an audit or dispute.

---

## 9. DEOS Coin — Platform Currency (superseded from "deferred," now specified per founder direction)

**Executive Summary:** DEOS Coin is the platform's internal unit of value — every deposit (§3a) converts into Coin, and Coin is the currency used to purchase memberships, marketplace products/services, AI credit top-ups, and other in-platform services. This section was originally deferred in v1.0; it is now specified in detail per the founder-provided deposit-flow mockup. **The legal-review requirement from v1.0 is not removed — it is widened, per the rationale below.**

**How the rate is set (critical open decision, not yet made):**
The mockup shows a "DEOS Coin Price" that moves ("$1.25, +4.35%") like a market-traded asset. This Book flags, as a founder decision still required, which of two fundamentally different models DEOS Coin actually is:

- **Model A — Fixed-value platform credit:** 1 Coin always equals a fixed amount of fiat (e.g., pegged 1:1 or at a fixed ratio), and never fluctuates. This behaves like a gift-card or airtime-style balance — lower regulatory complexity, closer to existing e-money/stored-value rules most jurisdictions already have frameworks for.
- **Model B — Market-priced token:** Coin's value floats based on platform-set or market-driven rates (as the mockup's "+4.35%" implies), meaning a member's Coin balance can gain or lose value independent of what they deposited. This is the model that most strongly resembles a security or virtual asset under most regulatory frameworks (Nigeria's SEC has specifically addressed virtual/digital assets; comparable rules exist via the SEC and FinCEN internationally) — it requires the most legal groundwork before real deposits touch it.

**Confirmed by founder: Model B — floating, market-style price.** DEOS Coin's value moves independently of what a member deposited, exactly as shown in the mockup ("$1.25, +4.35%").

**What this decision means, stated plainly:** a member who deposits $100 and receives 80 Coin can later find that same 80 Coin worth more or less than $100, purely from platform-set or market-driven rate movement — not from anything they did. That "value moved on its own" property is the specific feature that most legal frameworks look for when deciding whether something is a currency-exchange product, a virtual asset, or a security. This is not a reason to abandon the decision — it's a real product choice with upside (it can make holding Coin attractive, which supports platform engagement) — but it is the reason the legal-review gate in this Book cannot be treated as a formality. It should be treated with the same seriousness as the compensation-plan review in Book 0 Appendix C, and ideally by counsel who can look at both together, since a regulator evaluating DEOS is likely to see "buy a floating-price coin, use it to buy a membership, earn network commissions on recruiting" as one connected system.

**What is now locked for implementation purposes:**

**Why the legal-review gate widens, not narrows, with this decision:**
1. Real-money deposits (via USDT, bank transfer, card) converting into an internal unit used to purchase MLM-adjacent memberships stacks a money-transmission/virtual-asset question directly on top of the compensation-plan question already gated in Book 0 Appendix C — these two reviews should happen together, since regulators are likely to view the whole system as one product, not two separate ones.
2. If Model B is chosen, the "price go up" framing shown in the mockup is the single detail most likely to trigger securities-style scrutiny (an expectation of profit from the platform's efforts, independent of using the product) — this is worth raising with counsel explicitly, by name, not left implicit in a general "review the compensation plan" request.
3. Smart contract / blockchain settlement (if used for real, beyond just accepting USDT as a deposit *method*) remains a separate, larger technical and legal undertaking — this Book still recommends starting with Coin as an off-chain, database-ledgered internal balance (§11) rather than an on-chain token, regardless of which value model is chosen, since that keeps the system correctable (Book 0 §14 append-only, not immutable-on-chain) while the legal picture is still being resolved.

**What is specified now vs. still pending:**

| Specified now (§3a, §11) | Still pending founder/legal decision |
|---|---|
| Full deposit UX flow across 5 payment methods | **Resolved:** Model B (floating price) confirmed |
| Rate-lock and quote-expiry mechanics | **Resolved:** rate is admin-controlled for now (see new subsection below); migration to market/crypto-driven rate is a distinct future phase |
| Ledger event types for deposits and conversions | Whether Coin is ever redeemable back to fiat (a withdrawal-of-coin path), and under what terms |
| Security/warning UX for crypto deposits | On-chain vs. off-chain implementation (this Book recommends off-chain/database-ledgered to start, especially now that Model B is confirmed — an off-chain floating-price ledger is easier to correct if the legal review requires changes than an on-chain token would be) |
| — | Formal legal review scope explicitly covering virtual-asset/money-transmission/securities law — required before any Model B rate goes live with real deposits |

**Rate-Setting Mechanism (confirmed by founder):** For the initial launch phase, the DEOS Coin rate is **admin-controlled** — a Super Admin or Finance-role admin (Book 3 §2) sets and updates the rate through the Admin Platform (extending Book 3 §6's commission-rate management to include Coin rate management), not by real market trading or an external peg. The stated long-term intent is to migrate to a full crypto/market-driven environment once the platform reaches that stage — treated here as a distinct future phase (Book 0 §20 / Book 1 §12 roadmap), with its own build and its own legal review, not something to design now.

What this means concretely:
- The "price" and "% change" shown in the wallet UI (mockup: "$1.25, +4.35%") reflects admin-entered values, not live market data. `coin_rate_history` (§11) logs every admin rate change with actor and timestamp, exactly like a commission-rate change (Book 3 §6).
- **This sharpens, rather than softens, the legal-review question:** a "price" that only the platform controls, while still being displayed to members as something that gains or loses value on its own, is a materially different thing to explain to counsel than a rate discovered on an open market. This distinction should be stated explicitly, by name, when the legal review scope is defined — not left for counsel to discover on their own.
- **Business Rule:** Admin rate changes follow the same "confirm against current Book version" pattern as commission rate changes (Book 3 §6) — no silent, undocumented rate edits.
- When the platform eventually migrates to a real market/crypto-driven rate, that migration gets its own dedicated specification (likely its own Book, given the scope: exchange integration, liquidity, smart contracts) — this Book's admin-controlled model is explicitly a starting point, not the end state.

---

## 10. KYC & Withdrawal Security

**Functional Requirements:** identity verification flow for withdrawals above threshold (§4), document upload, verification status. Per Book 0 §11, KYC/identity documents are stored separately from behavioral/business data with stricter access controls than general profile information.

---

## 11. Database Requirements

- `wallet_balances` — member_id, fiat_equivalent_balance, coin_balance, available_balance (distinct from pending/held amounts)
- `wallet_transactions` — append-only per Book 0 §14; type (`deposit`, `withdrawal`, `transfer_in`, `transfer_out`, `coin_conversion`, `earning_binary`, `earning_marketplace`, etc. — reusing the exact typed events from Book 4 §15 and Book 5 §14, not a generic "credit/debit" type)
- `coin_deposit_requests` — deposit_id, member_id, payment_method, fiat_amount, coin_amount_quoted, rate_locked, quote_expires_at, status (pending/confirmed/expired), payment_reference (e.g., blockchain tx hash for crypto) — supports the full Step 1–6 flow in §3a with a clear audit trail per attempt, including expired/abandoned quotes
- `coin_rate_history` — timestamped rate snapshots, required regardless of whether Model A or B (§9) is chosen, since even a "fixed" rate should be versioned if it's ever adjusted by the platform
- `treasury_fund_ledger` — separate table from member wallets (§8), tracking Fund inflows by source type
- `kyc_records` — segregated storage, restricted access (§10)

---

## 12. Acceptance Criteria

- [ ] Every wallet balance figure reconciles exactly with the underlying typed transaction ledger — no unexplained aggregate figures
- [ ] Withdrawal above threshold cannot be released without both KYC verification and Finance-role approval
- [ ] Treasury Fund balance is architecturally and visibly separate from any individual member's wallet
- [ ] Coin is credited only after payment is confirmed by the actual payment processor/blockchain network — never on the member's "I have sent payment" click alone
- [ ] Deposit quote rate locks at confirmation and is honestly time-boxed (visible countdown matches actual quote-validity window server-side)
- [ ] Crypto deposit UI prominently warns against wrong-asset/wrong-network sends before an address is shown
- [x] **Founder decision made:** Model B (floating-price) confirmed for Coin
- [x] Rate-setting mechanism confirmed: admin-controlled for launch phase, migration to market/crypto-driven rate deferred as its own future phase
- [ ] No real-money deposit flow goes live before Book 0 Appendix C's legal review is explicitly extended to cover virtual-asset/money-transmission/securities law, not just MLM compensation law — this is now higher-priority given the Model B confirmation
