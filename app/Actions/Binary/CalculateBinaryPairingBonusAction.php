<?php

namespace App\Actions\Binary;

use App\Actions\Wallet\CreditWalletAction;
use App\Enums\LedgerEventType;
use App\Enums\MemberStatus;
use App\Models\LedgerTransaction;
use App\Models\Member;
use Illuminate\Support\Facades\DB;

class CalculateBinaryPairingBonusAction
{
    public function __construct(protected CreditWalletAction $creditAction) {}

    public function execute(Member $member): ?array
    {
        return DB::transaction(function () use ($member) {
            $lockedMember = Member::where('id', $member->id)->lockForUpdate()->first();

            if (!$lockedMember || $lockedMember->status !== MemberStatus::ACTIVE) {
                return null;
            }

            $leftVol = (float) $lockedMember->binary_left_volume;
            $rightVol = (float) $lockedMember->binary_right_volume;

            if ($leftVol <= 0 || $rightVol <= 0) {
                return null;
            }

            // 1:1 Matching on weaker leg volume
            $matchedVolume = min($leftVol, $rightVol);
            $rawBonusAmount = $matchedVolume * 0.10; // Flat 10% binary bonus rate (Book 4 §10)

            // Tier Daily Cap Enforcement (Safety Guardrail)
            $dailyCap = $lockedMember->plan->dailyBinaryCap();
            $alreadyPaidToday = (float) LedgerTransaction::where('member_id', $lockedMember->id)
                ->where('type', LedgerEventType::BINARY_COMMISSION->value)
                ->whereDate('created_at', now()->toDateString())
                ->sum('amount');

            $availableCap = max(0.0, $dailyCap - $alreadyPaidToday);
            $payableBonus = min($rawBonusAmount, $availableCap);

            // Deduct matched volume from both legs and preserve carryover volume
            $lockedMember->binary_left_volume -= $matchedVolume;
            $lockedMember->binary_right_volume -= $matchedVolume;
            $lockedMember->save();

            $ledgerTx = null;
            if ($payableBonus > 0) {
                $ledgerTx = $this->creditAction->execute(
                    $lockedMember,
                    $payableBonus,
                    LedgerEventType::BINARY_COMMISSION,
                    "Daily 10% Binary Matching Bonus on {$matchedVolume} BV" . ($rawBonusAmount > $payableBonus ? " (Tier Daily Cap Applied: \${$dailyCap})" : ''),
                    null,
                    [
                        'matched_volume' => $matchedVolume,
                        'raw_bonus' => $rawBonusAmount,
                        'payable_bonus' => $payableBonus,
                        'daily_cap' => $dailyCap,
                        'already_paid_today' => $alreadyPaidToday,
                        'capped_out' => $rawBonusAmount > $payableBonus,
                        'carryover_left' => (float) $lockedMember->binary_left_volume,
                        'carryover_right' => (float) $lockedMember->binary_right_volume,
                    ],
                    'binary_engine'
                );
            }

            return [
                'member_id' => $lockedMember->id,
                'member_code' => $lockedMember->member_code,
                'matched_volume' => $matchedVolume,
                'raw_bonus' => $rawBonusAmount,
                'bonus_amount' => $payableBonus,
                'daily_cap' => $dailyCap,
                'already_paid_today' => $alreadyPaidToday,
                'is_capped' => $rawBonusAmount > $payableBonus,
                'remaining_left' => (float) $lockedMember->binary_left_volume,
                'remaining_right' => (float) $lockedMember->binary_right_volume,
                'ledger_id' => $ledgerTx?->id,
            ];
        });
    }
}
