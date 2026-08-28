<?php

namespace App\Services;

use App\Actions\Wallet\CreditWalletAction;
use App\Actions\Wallet\DebitWalletAction;
use App\Actions\Wallet\RequestWithdrawalAction;
use App\Enums\LedgerEventType;
use App\Models\LedgerTransaction;
use App\Models\Member;
use App\Models\WithdrawalRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class WalletLedgerService
{
    public function __construct(
        protected CreditWalletAction $creditAction,
        protected DebitWalletAction $debitAction,
        protected RequestWithdrawalAction $withdrawalAction
    ) {}

    public function getBalance(Member $member): array
    {
        return [
            'wallet_balance' => (float) $member->wallet_balance,
            'usdt_balance' => (float) $member->usdt_balance,
            'currency' => 'EVO',
            'fixed_rate' => '1.00 USD = 1.00 EVO',
        ];
    }

    public function getTransactions(Member $member, int $perPage = 20): LengthAwarePaginator
    {
        return LedgerTransaction::where('member_id', $member->id)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function transfer(Member $sender, string $recipientIdentifier, float $amount, ?string $note = null): array
    {
        return DB::transaction(function () use ($sender, $recipientIdentifier, $amount, $note) {
            $recipient = Member::where('member_code', $recipientIdentifier)
                ->orWhere('email', strtolower(trim($recipientIdentifier)))
                ->first();

            if (!$recipient) {
                throw new InvalidArgumentException('Recipient not found with the provided identifier.');
            }

            if ($recipient->id === $sender->id) {
                throw new InvalidArgumentException('Cannot transfer funds to your own wallet.');
            }

            // Debit sender
            $this->debitAction->execute(
                $sender,
                $amount,
                LedgerEventType::WALLET_TRANSFER_OUT,
                "Transfer to {$recipient->name} ({$recipient->member_code})" . ($note ? ": {$note}" : '')
            );

            // Credit recipient
            $this->creditAction->execute(
                $recipient,
                $amount,
                LedgerEventType::WALLET_TRANSFER_IN,
                "Transfer from {$sender->name} ({$sender->member_code})" . ($note ? ": {$note}" : '')
            );

            return [
                'recipient_name' => $recipient->name,
                'recipient_code' => $recipient->member_code,
                'amount_transferred' => $amount,
                'new_balance' => $sender->fresh()->wallet_balance,
            ];
        });
    }

    public function requestWithdrawal(Member $member, array $data): WithdrawalRequest
    {
        return $this->withdrawalAction->execute($member, $data);
    }
}
