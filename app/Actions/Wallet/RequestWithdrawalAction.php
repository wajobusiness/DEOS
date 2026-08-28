<?php

namespace App\Actions\Wallet;

use App\Enums\LedgerEventType;
use App\Models\Member;
use App\Models\WithdrawalRequest;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class RequestWithdrawalAction
{
    public function __construct(protected DebitWalletAction $debitAction) {}

    public function execute(Member $member, array $data): WithdrawalRequest
    {
        return DB::transaction(function () use ($member, $data) {
            $amount = (float) $data['amount'];

            if ($member->wallet_balance < $amount) {
                throw new InvalidArgumentException('Insufficient funds for withdrawal.');
            }

            // Debit from wallet into escrow
            $this->debitAction->execute(
                $member,
                $amount,
                LedgerEventType::WALLET_WITHDRAWAL,
                "Withdrawal request via {$data['destination_type']} to {$data['destination_address']}"
            );

            return WithdrawalRequest::create([
                'member_id' => $member->id,
                'amount' => $amount,
                'currency' => 'USDT',
                'destination_type' => $data['destination_type'],
                'destination_address' => $data['destination_address'],
                'bank_name' => $data['bank_name'] ?? null,
                'account_name' => $data['account_name'] ?? null,
                'status' => 'pending',
            ]);
        });
    }
}
