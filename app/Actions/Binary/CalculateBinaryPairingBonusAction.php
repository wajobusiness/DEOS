<?php

namespace App\Actions\Binary;

use App\Actions\Wallet\CreditWalletAction;
use App\Enums\LedgerEventType;
use App\Models\Member;
use Illuminate\Support\Facades\DB;

class CalculateBinaryPairingBonusAction
{
    public function __construct(protected CreditWalletAction $creditAction) {}

    public function execute(Member $member): ?array
    {
        return DB::transaction(function () use ($member) {
            $lockedMember = Member::where('id', $member->id)->lockForUpdate()->first();
            $leftVol = (float) $lockedMember->binary_left_volume;
            $rightVol = (float) $lockedMember->binary_right_volume;

            if ($leftVol <= 0 || $rightVol <= 0) {
                return null;
            }

            // Weaker leg matching volume
            $matchedVolume = min($leftVol, $rightVol);
            $commissionAmount = $matchedVolume * 0.10; // Flat 10% binary matching bonus

            // 1/3 volume carryover reduction
            $lockedMember->binary_left_volume -= $matchedVolume;
            $lockedMember->binary_right_volume -= $matchedVolume;
            $lockedMember->save();

            $tx = $this->creditAction->execute(
                $lockedMember,
                $commissionAmount,
                LedgerEventType::BINARY_COMMISSION,
                "Daily 10% Binary Matching Bonus on {$matchedVolume} BV"
            );

            return [
                'matched_volume' => $matchedVolume,
                'bonus_amount' => $commissionAmount,
                'remaining_left' => $lockedMember->binary_left_volume,
                'remaining_right' => $lockedMember->binary_right_volume,
            ];
        });
    }
}
