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
use Illuminate\Support\Str;
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
        $fresh = Member::find($member->id);

        return [
            'wallet_balance' => (float) ($fresh?->wallet_balance ?? $member->wallet_balance),
            'usdt_balance' => (float) ($fresh?->usdt_balance ?? $member->usdt_balance),
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
        if ($amount <= 0) {
            throw new InvalidArgumentException('Transfer amount must be strictly greater than zero.');
        }

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

            // Deadlock-free locking: Acquire row locks in deterministic UUID sort order
            $ids = [$sender->id, $recipient->id];
            sort($ids, SORT_STRING);

            $lockedMembers = Member::whereIn('id', $ids)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $lockedSender = $lockedMembers->get($sender->id);
            $lockedRecipient = $lockedMembers->get($recipient->id);

            if (!$lockedSender || !$lockedRecipient) {
                throw new InvalidArgumentException('Failed to lock accounts for transaction.');
            }

            if ((float) $lockedSender->wallet_balance < $amount) {
                throw new InvalidArgumentException(
                    'Insufficient wallet balance. Available: ' . number_format($lockedSender->wallet_balance, 4) . ' EVO'
                );
            }

            $transferCorrelationId = 'TRF-' . strtoupper(Str::random(12));
            $outRef = $transferCorrelationId . '-OUT';
            $inRef = $transferCorrelationId . '-IN';

            // Debit sender
            $debitTx = $this->debitAction->execute(
                $lockedSender,
                $amount,
                LedgerEventType::WALLET_TRANSFER_OUT,
                "P2P Transfer to {$lockedRecipient->name} ({$lockedRecipient->member_code})" . ($note ? ": {$note}" : ''),
                $outRef,
                [
                    'correlation_id' => $transferCorrelationId,
                    'counterparty_id' => $lockedRecipient->id,
                    'counterparty_name' => $lockedRecipient->name,
                    'counterparty_code' => $lockedRecipient->member_code,
                    'note' => $note,
                ],
                'p2p_transfer'
            );

            // Credit recipient
            $creditTx = $this->creditAction->execute(
                $lockedRecipient,
                $amount,
                LedgerEventType::WALLET_TRANSFER_IN,
                "P2P Transfer from {$lockedSender->name} ({$lockedSender->member_code})" . ($note ? ": {$note}" : ''),
                $inRef,
                [
                    'correlation_id' => $transferCorrelationId,
                    'counterparty_id' => $lockedSender->id,
                    'counterparty_name' => $lockedSender->name,
                    'counterparty_code' => $lockedSender->member_code,
                    'note' => $note,
                ],
                'p2p_transfer'
            );

            $refreshedSender = $lockedSender->fresh();

            return [
                'correlation_id' => $transferCorrelationId,
                'recipient_name' => $lockedRecipient->name,
                'recipient_code' => $lockedRecipient->member_code,
                'amount_transferred' => $amount,
                'sender_balance_before' => $debitTx->balance_before,
                'sender_balance_after' => $debitTx->balance_after,
                'recipient_balance_before' => $creditTx->balance_before,
                'recipient_balance_after' => $creditTx->balance_after,
                'new_balance' => (float) $refreshedSender->wallet_balance,
            ];
        });
    }

    public function requestWithdrawal(Member $member, array $data): WithdrawalRequest
    {
        return $this->withdrawalAction->execute($member, $data);
    }
}
