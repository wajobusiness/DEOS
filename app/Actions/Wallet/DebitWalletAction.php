<?php

namespace App\Actions\Wallet;

use App\Enums\LedgerEventType;
use App\Models\LedgerTransaction;
use App\Models\Member;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class DebitWalletAction
{
    public function execute(
        Member $member,
        float $amount,
        LedgerEventType $type,
        string $description,
        ?string $referenceId = null,
        array $metadata = [],
        string $channel = 'internal'
    ): LedgerTransaction {
        if ($amount <= 0) {
            throw new InvalidArgumentException('Debit amount must be strictly positive.');
        }

        return DB::transaction(function () use ($member, $amount, $type, $description, $referenceId, $metadata, $channel) {
            // Pessimistic row-level lock
            $lockedMember = Member::where('id', $member->id)->lockForUpdate()->firstOrFail();

            $balanceBefore = (float) $lockedMember->wallet_balance;

            if ($balanceBefore < $amount) {
                throw new InvalidArgumentException('Insufficient wallet balance. Available: ' . number_format($balanceBefore, 4) . ' EVO, Requested: ' . number_format($amount, 4) . ' EVO');
            }

            $balanceAfter = $balanceBefore - $amount;

            $lockedMember->wallet_balance = $balanceAfter;
            $lockedMember->save();

            return LedgerTransaction::create([
                'member_id' => $lockedMember->id,
                'type' => $type->value,
                'amount' => -$amount,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'currency' => 'EVO',
                'channel' => $channel,
                'description' => $description,
                'status' => 'Completed',
                'reference_id' => $referenceId ?? ('REF-' . strtoupper(Str::random(12))),
                'metadata' => $metadata,
            ]);
        });
    }
}
