<?php

namespace App\Actions\Binary;

use App\Actions\Wallet\CreditWalletAction;
use App\Enums\LedgerEventType;
use App\Enums\MemberStatus;
use App\Enums\PlanTier;
use App\Models\Member;
use Illuminate\Support\Facades\DB;

class CalculateDirectAndGenerationBonusAction
{
    public function __construct(protected CreditWalletAction $creditAction) {}

    public function execute(Member $buyer, PlanTier $purchasedPlan): array
    {
        return DB::transaction(function () use ($buyer, $purchasedPlan) {
            $disbursements = [];
            $fullDirectBonus = $purchasedPlan->directBonus();
            $sponsor = $buyer->sponsor_id ? Member::find($buyer->sponsor_id) : null;

            // 1. Direct Referral Commission & Split Commission Check
            if ($sponsor && $sponsor->status === MemberStatus::ACTIVE) {
                $sponsorQualifiedRate = $sponsor->plan->directBonus();

                if ($sponsorQualifiedRate >= $fullDirectBonus) {
                    // Fully qualified
                    $tx = $this->creditAction->execute(
                        $sponsor,
                        $fullDirectBonus,
                        LedgerEventType::DIRECT_REFERRAL_BONUS,
                        "Direct Referral Bonus for {$buyer->name} ({$purchasedPlan->value})",
                        null,
                        ['buyer_id' => $buyer->id, 'plan' => $purchasedPlan->value],
                        'sponsor_commission'
                    );

                    $disbursements['direct_bonus'] = [
                        'recipient_id' => $sponsor->id,
                        'recipient_code' => $sponsor->member_code,
                        'amount' => $fullDirectBonus,
                        'status' => 'fully_qualified',
                    ];
                } else {
                    // Under-qualified: Split Commission Logic (Book 4 §7 & §8)
                    $sponsorShare = min($sponsorQualifiedRate, $fullDirectBonus);
                    $difference = $fullDirectBonus - $sponsorShare;
                    $platformShare = $difference * 0.50;
                    $uplineShare = $difference * 0.50;

                    // Credit direct sponsor with their qualified portion
                    $this->creditAction->execute(
                        $sponsor,
                        $sponsorShare,
                        LedgerEventType::DIRECT_REFERRAL_BONUS,
                        "Direct Referral Bonus (Plan-Capped @ {$sponsor->plan->value}) for {$buyer->name}",
                        null,
                        ['buyer_id' => $buyer->id, 'plan' => $purchasedPlan->value, 'full_bonus' => $fullDirectBonus],
                        'sponsor_commission'
                    );

                    // Find nearest qualified upline in sponsor tree
                    $qualifiedUpline = $this->findNearestQualifiedUpline($sponsor, $fullDirectBonus);

                    if ($qualifiedUpline) {
                        $this->creditAction->execute(
                            $qualifiedUpline,
                            $uplineShare,
                            LedgerEventType::SPLIT_COMMISSION_UPLINE,
                            "Split Commission Upline Override ({$buyer->name} -> {$sponsor->member_code})",
                            null,
                            ['buyer_id' => $buyer->id, 'sponsor_id' => $sponsor->id, 'plan' => $purchasedPlan->value],
                            'split_commission'
                        );

                        $disbursements['split_upline'] = [
                            'recipient_id' => $qualifiedUpline->id,
                            'recipient_code' => $qualifiedUpline->member_code,
                            'amount' => $uplineShare,
                        ];
                    } else {
                        // No qualified upline exists in sponsor chain; full difference routes to platform treasury
                        $platformShare += $uplineShare;
                    }

                    $disbursements['direct_bonus'] = [
                        'recipient_id' => $sponsor->id,
                        'recipient_code' => $sponsor->member_code,
                        'amount' => $sponsorShare,
                        'status' => 'split_commission',
                        'platform_fund_share' => $platformShare,
                    ];
                }
            } else {
                // Inactive sponsor or no sponsor -> Full direct bonus routes to platform fund
                $disbursements['direct_bonus'] = [
                    'recipient_id' => null,
                    'amount' => $fullDirectBonus,
                    'status' => 'platform_fund_unqualified',
                ];
            }

            // 2. 2nd Generation Leadership Bonus (30% of Direct Bonus)
            $gen2Sponsor = $sponsor && $sponsor->sponsor_id ? Member::find($sponsor->sponsor_id) : null;
            $gen2Amount = $fullDirectBonus * 0.30;

            if ($gen2Sponsor && $gen2Sponsor->status === MemberStatus::ACTIVE) {
                $this->creditAction->execute(
                    $gen2Sponsor,
                    $gen2Amount,
                    LedgerEventType::GENERATION_BONUS,
                    "2nd Gen Leadership Bonus from {$buyer->name} ({$purchasedPlan->value})",
                    null,
                    ['buyer_id' => $buyer->id, 'generation' => 2, 'direct_sponsor_id' => $sponsor?->id],
                    'generation_bonus'
                );

                $disbursements['generation_2'] = [
                    'recipient_id' => $gen2Sponsor->id,
                    'recipient_code' => $gen2Sponsor->member_code,
                    'amount' => $gen2Amount,
                ];
            } else {
                $disbursements['generation_2'] = [
                    'recipient_id' => null,
                    'amount' => $gen2Amount,
                    'status' => 'platform_fund',
                ];
            }

            // 3. 3rd Generation Leadership Bonus (15% of Direct Bonus)
            $gen3Sponsor = $gen2Sponsor && $gen2Sponsor->sponsor_id ? Member::find($gen2Sponsor->sponsor_id) : null;
            $gen3Amount = $fullDirectBonus * 0.15;

            if ($gen3Sponsor && $gen3Sponsor->status === MemberStatus::ACTIVE) {
                $this->creditAction->execute(
                    $gen3Sponsor,
                    $gen3Amount,
                    LedgerEventType::GENERATION_BONUS,
                    "3rd Gen Leadership Bonus from {$buyer->name} ({$purchasedPlan->value})",
                    null,
                    ['buyer_id' => $buyer->id, 'generation' => 3, 'direct_sponsor_id' => $sponsor?->id],
                    'generation_bonus'
                );

                $disbursements['generation_3'] = [
                    'recipient_id' => $gen3Sponsor->id,
                    'recipient_code' => $gen3Sponsor->member_code,
                    'amount' => $gen3Amount,
                ];
            } else {
                $disbursements['generation_3'] = [
                    'recipient_id' => null,
                    'amount' => $gen3Amount,
                    'status' => 'platform_fund',
                ];
            }

            return $disbursements;
        });
    }

    protected function findNearestQualifiedUpline(Member $sponsor, float $requiredDirectBonus): ?Member
    {
        $current = $sponsor;
        while (!empty($current->sponsor_id)) {
            $parentSponsor = Member::find($current->sponsor_id);
            if (!$parentSponsor) {
                break;
            }

            if ($parentSponsor->status === MemberStatus::ACTIVE && $parentSponsor->plan->directBonus() >= $requiredDirectBonus) {
                return $parentSponsor;
            }

            $current = $parentSponsor;
        }

        return null;
    }
}
