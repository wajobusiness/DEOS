<?php

namespace App\Actions\Wallet;

use App\Enums\LedgerEventType;
use App\Models\LedgerTransaction;
use App\Models\Member;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class CreditWalletAction
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
            throw new InvalidArgumentException('Credit amount must be strictly positive.');
        }

        return DB::transaction(function () use ($member, $amount, $type, $description, $referenceId, $metadata, $channel) {
            // Lock row with pessimistic lock
            $lockedMember = Member::where('id', $member->id)->lockForUpdate()->firstOrFail();

            $balanceBefore = (float) $lockedMember->wallet_balance;
            $balanceAfter = $balanceBefore + $amount;

            $lockedMember->wallet_balance = $balanceAfter;
            $lockedMember->save();

            return LedgerTransaction::create([
                'member_id' => $lockedMember->id,
                'type' => $type->value,
                'amount' => $amount,
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
