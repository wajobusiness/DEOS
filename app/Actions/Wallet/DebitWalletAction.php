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
    public function execute(Member $member, float $amount, LedgerEventType $type, string $description, ?string $referenceId = null, array $metadata = []): LedgerTransaction
    {
        return DB::transaction(function () use ($member, $amount, $type, $description, $referenceId, $metadata) {
            $lockedMember = Member::where('id', $member->id)->lockForUpdate()->first();

            if ($lockedMember->wallet_balance < $amount) {
                throw new InvalidArgumentException('Insufficient wallet balance. Available: ' . $lockedMember->wallet_balance);
            }

            $lockedMember->wallet_balance -= $amount;
            $lockedMember->save();

            return LedgerTransaction::create([
                'member_id' => $lockedMember->id,
                'type' => $type->value,
                'amount' => -$amount,
                'currency' => 'EVO',
                'description' => $description,
                'status' => 'Completed',
                'reference_id' => $referenceId ?? ('REF-' . strtoupper(Str::random(12))),
                'metadata' => $metadata,
            ]);
        });
    }
}
