# DEOS — Digital Entrepreneurship Operating System
## Book 4: MLM Binary Engine

**Version:** 1.1 — rate decisions locked with founder on this date; still pending Book 0 Appendix C legal review and the financial simulation in §11 before production implementation
**Status:** Draft — mathematical logic confirmed; **not cleared for implementation until Book 0 Appendix C legal review and the financial simulation in §11 are both signed off**
**Governed by:** Book 0 (Constitution), Book 1 (Business Blueprint), Book 2 (User Platform)

**v1.1 change log:**
- Binary Bonus Rate confirmed at 10% flat across all plan tiers (resolves the 10%/15% mockup discrepancy — mockup to be corrected in the Image 13 UI to match)
- Generation Bonus table corrected — duplicate "1st Generation" row removed
- Weaker-leg binary commission confirmed **uncapped** — accepted as a known sustainability risk, to be monitored via the §11 simulator and revisited if real growth data shows strain
- Qualification rule (§12) confirmed: an active, non-lapsed membership is sufficient — no additional minimum personal or team activity threshold required

> This Book defines every formula, rule, and edge case for referral-based earning. Nothing in this Book may be coded into the Financial Layer without the sign-offs noted above (Book 0 §12.6 is binding here specifically). Where this Book and Book 1's illustrative figures differ, this Book is authoritative for engineering purposes — but both remain provisional pending legal and financial review.

---

## Table of Contents

1. Purpose & Scope
2. Core Definitions
3. Binary Tree Structure
4. Sponsor Tree vs. Placement Tree
5. Spillover Rules
6. Direct Referral Commission
7. Commission Qualification (Plan-Capped Earning)
8. Split Commission Model
9. Generation Bonus
10. Binary Commission (Weaker Leg)
11. Compensation Simulator Requirement
12. Qualification & Activity Rules
13. Edge Cases
14. Fraud & Abuse Prevention
15. Database & Ledger Requirements
16. Acceptance Criteria

---

## 1. Purpose & Scope

This Book governs only the **network/referral compensation layer** (binary tree, direct bonus, generation bonus). It does **not** govern marketplace/promoter commissions or the product-sale upline override — those are defined in Book 5 (Marketplace) and referenced from Book 0 §9, and are ledgered as separate event types deliberately, so that the network layer and the commerce layer can each be independently measured, reported, and — if required by legal review — adjusted or disabled without affecting the other.

---

## 2. Core Definitions

| Term | Definition |
|---|---|
| **BV (Business Volume)** | Point value assigned to a membership purchase for binary calculation. Launch = 100 BV, Growth = 300 BV, Legacy = 500 BV. |
| **Sponsor** | The member whose referral link/code was used at registration. Permanent, never changes. |
| **Placement** | The tree position a new member is placed into, which may differ from their sponsor due to spillover (§5). |
| **Leg** | Left or right branch beneath a member. |
| **Weaker Leg** | The leg with lower accumulated BV at time of calculation. |
| **Carry Forward** | Unused BV on the stronger leg that rolls over to the next calculation period rather than being forfeited. |
| **Qualification** | The activity/plan-tier state a member must maintain to be eligible for a given bonus (§12). |

---

## 3. Binary Tree Structure

Every member has exactly two first-level positions: Left and Right.

```
                 MEMBER
              /        \
         Left          Right
        /    \        /     \
      L1     L2     R1      R2
```

Once L1/L2 and R1/R2 are filled, new referrals are placed **beneath** those positions per the placement algorithm (§4), not beside them — the tree is strictly binary at every level, unlimited in depth.

**Functional Requirement:** Tree traversal queries (leg volume, weaker leg, depth) must be efficient at scale — Book 12 (Database Architecture) must specify an indexed nested-set or closure-table model, not naive recursive queries, given trees may reach tens of thousands of nodes (as shown in the mockup: 256 total network members for a single active member).

---

## 4. Sponsor Tree vs. Placement Tree

DEOS maintains **two separate parent relationships** per member:

- **Sponsor Tree** — who directly referred this member (used for Direct Referral Commission, §6, and Generation Bonus, §9). Fixed at registration, never changes.
- **Placement Tree** — where the member physically sits in the binary structure (used for Binary Commission, §10). Can differ from sponsor due to spillover.

**This distinction is mandatory**, not optional — collapsing sponsor and placement into a single relationship (a common shortcut) breaks the math the moment spillover occurs, and makes commission disputes unresolvable.

---

## 5. Spillover Rules

When a sponsor's two placement positions (Left/Right) are already occupied, their next new referral is placed at the next available open position, found by a defined, deterministic search order:

**Placement algorithm (must be specified exactly before coding):**
1. Search the sponsor's preferred leg first, if the sponsor has set a preference (per Image 13's "Two Per Leg" toggle — sponsor can indicate a leg preference in Settings).
2. If no preference set, alternate Left/Right for successive spillover placements (balanced default).
3. Search breadth-first (fill shallower open positions before deeper ones) to keep the tree balanced, unless admin configuration specifies depth-first.

**Business Rule:** The placement algorithm must be fixed and documented before launch — changing it after members are actively growing their trees is a major, disruptive change requiring its own migration plan and member communication.

---

## 6. Direct Referral Commission

Paid to the **sponsor** (not the placement parent) when their direct referral purchases a membership.

| Membership Purchased | Direct Bonus |
|---|---|
| Launch ($100) | $25 |
| Growth ($300) | $75 |
| Legacy ($500) | $125 |

---

## 7. Commission Qualification (Plan-Capped Earning)

A member earns commission **at their own active plan's rate**, never higher — this is a Book 0 §12.2 constitutional rule, restated here with full worked logic.

**Example:** A Launch ($100) member refers a Legacy ($500) purchaser. The Legacy-tier direct bonus is $125, but the Launch-tier sponsor only qualifies for $25. The $100 gap is resolved via Split Commission (§8) — it is never simply paid at the higher rate, and never simply forfeited without a defined destination.

---

## 8. Split Commission Model

When a sponsor is under-qualified for the full commission their referral's purchase would generate:

- Sponsor receives their own plan-tier's commission.
- The **difference** splits: 50% to the Platform Sustainability Fund (Book 0 Layer 4 Treasury), 50% to the nearest **qualified upline** (the first ancestor in the sponsor tree whose plan tier qualifies for the full amount).

**Worked example:**
- Downline purchases Legacy ($500) → full direct commission = $125
- Direct sponsor holds Launch, qualifies for $25
- Difference = $100 → Platform Fund: $50, nearest qualified upline: $50

**Edge case — no qualified upline exists in the chain:** the full unqualified difference (100%, not just the upline's 50% share) routes to the Platform Sustainability Fund. This must be explicit in code — a missing recipient must never silently error or block the transaction.

---

## 9. Generation Bonus

Paid to ancestors in the **sponsor tree** (not placement tree) based on a referral chain, as a percentage of the Direct Bonus their descendant earned. The direct sponsor's own payment is the Direct Referral Commission in §6 — it is not repeated here as a "1st Generation" line, since that would double-pay the same event.

| Generation | Bonus |
|---|---|
| 2nd Generation | 30% of direct bonus |
| 3rd Generation | 15% of direct bonus |

**Qualification for Generation Bonus:** the ancestor must hold an active, non-lapsed membership per §12 to receive generation-level payouts — no additional minimum activity threshold applies (confirmed with founder). An unqualified (lapsed) ancestor is skipped, and their share routes to the Platform Sustainability Fund per the same fallback logic as Split Commission (§8) and the Marketplace Upline Override (Book 5 §8) — kept consistent across all three mechanisms.

---

## 10. Binary Commission (Weaker Leg)

```
Binary Bonus = Weaker Leg BV × Binary Bonus Rate
```

**Confirmed rate: 10% flat across all plan tiers.** (The Image 13 mockup showing 15% for Launch was a UI placeholder and should be corrected to 10% to match this Book.)

Unused BV on the stronger leg **carries forward** to the next period rather than being forfeited (per Image 13's "Carry Forward Volume" field).

**Business Rule:** Binary commission is **uncapped** per period, by founder decision. This is a deliberate, accepted risk — not an oversight — and must be actively monitored: the §11 simulator should specifically track total binary payout as network volume scales, and this decision should be revisited with real data (not just projections) within the first two full commission cycles after launch.

---

## 11. Compensation Simulator Requirement

**This is a hard gate, not a recommendation.** Per your own original direction and Book 0 Appendix C, before any commission rule in this Book is implemented in production code:

1. Build a standalone simulator (spreadsheet or script) modeling: slow growth, rapid growth, balanced network, heavy spillover, high inactive-member rate.
2. Verify that under every modeled scenario, total payout obligations stay below total revenue collected, with the Platform Operations/Treasury allocations (Book 1 §7.3) remaining intact.
3. Specifically stress-test the **uncapped weaker-leg binary formula** (§10) — this is the formula most likely to become unsustainable at scale if left uncapped.
4. Only after the simulator confirms sustainability does this Book's numbers get frozen into a versioned, implementable spec.

---

## 12. Qualification & Activity Rules

**Confirmed by founder:** the only requirement to remain eligible for any commission type in this Book is holding an **active, non-lapsed membership** (per Book 2 Chapter 20). No additional minimum personal BV or team-activity threshold is required.

This is noted as a product decision with a tradeoff: it lowers the barrier to earning (good for member experience and growth), but means "buy and hold" members qualify for payouts without further engagement. If this proves to encourage low-engagement membership at scale, revisit as a v2 policy change — not a Book 0 constitutional issue, since it doesn't affect the commerce-vs-recruitment balance, only how strictly earning is gated within the recruitment layer itself.

---

## 13. Edge Cases

| Case | Rule |
|---|---|
| Sponsor account lapses (Book 2 Ch. 20) mid-period | Commission accrual for that period pauses; does not retroactively cancel already-paid history (Book 0 §14 append-only) |
| Referral registers with no sponsor code | Placed under default/company account (Book 2 Chapter 2) — earns for the company treasury, not an individual |
| Split Commission with no qualified upline in chain | 100% of the differential routes to Platform Sustainability Fund (§8) |
| Generation Bonus with an unqualified intermediate ancestor | Confirmed: share routes to Platform Sustainability Fund (does not skip to the next qualified ancestor) — consistent with Split Commission (§8) fallback |
| Member disputes their tree placement | Placement is immutable once spillover occurs (§5) — disputes are handled via support/admin review (Book 3), never by silently moving tree nodes, since that would corrupt historical commission calculations |

---

## 14. Fraud & Abuse Prevention

Per Book 0 §11 and §19, the following patterns must be detectable (full detection logic specified in Book 13 — Security):
- Self-referral (same individual registering as both sponsor and downline via different identities)
- Circular placement structures designed purely to trigger spillover commissions with no real recruitment
- Rapid-fire low-value "churn and rejoin" patterns designed to farm direct bonuses

---

## 15. Database & Ledger Requirements

Per Book 0 §14 (append-only, actor-tagged):
- `binary_tree_nodes` — member_id, sponsor_id, placement_parent_id, leg, depth
- `binary_volume_events` — member_id, bv_amount, source_transaction_id, period
- `commission_ledger` — event_type (`direct_referral_bonus` | `binary_commission` | `generation_bonus` | `split_commission_platform` | `split_commission_upline`), amount, recipient_id, source_member_id, period, created_at
- Every row traceable back to the originating membership purchase transaction

---

## 16. Acceptance Criteria

- [x] Generation Bonus table conflict (§9) resolved — starts at 2nd Generation, no duplicate 1st Gen line
- [x] Binary Bonus Rate confirmed at 10% flat — Image 13 mockup to be corrected to match
- [x] Qualification rule confirmed — active membership only, no minimum activity threshold
- [x] Binary commission cap decision made — confirmed uncapped, accepted as a monitored risk
- [ ] Compensation simulator (§11) completed and reviewed before any commission formula is implemented — **still required despite rates being confirmed**, since the simulator validates sustainability of the confirmed numbers, not just their internal consistency
- [ ] Legal review (Book 0 Appendix C) completed and signed off before launch
- [ ] Every commission type produces exactly one traceable, typed ledger entry per event — no untyped or bundled payouts
- [ ] Uncapped binary payout specifically monitored against real data in first two commission cycles post-launch, per §10
