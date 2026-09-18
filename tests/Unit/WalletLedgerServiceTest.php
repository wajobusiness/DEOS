<?php

namespace Tests\Unit;

use App\Actions\Wallet\CreditWalletAction;
use App\Actions\Wallet\DebitWalletAction;
use App\Actions\Wallet\RequestWithdrawalAction;
use App\Enums\LedgerEventType;
use App\Models\Member;
use App\Services\WalletLedgerService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use Tests\TestCase;

class WalletLedgerServiceTest extends TestCase
{
    use RefreshDatabase;

    protected WalletLedgerService $walletService;
    protected CreditWalletAction $creditAction;
    protected DebitWalletAction $debitAction;

    protected function setUp(): void
    {
        parent::setUp();
        $this->creditAction = new CreditWalletAction();
        $this->debitAction = new DebitWalletAction();
        $withdraw = new RequestWithdrawalAction($this->debitAction);
        $this->walletService = new WalletLedgerService($this->creditAction, $this->debitAction, $withdraw);
    }

    public function test_credit_increases_wallet_balance_and_creates_ledger_entry(): void
    {
        $member = Member::factory()->create(['wallet_balance' => 100.00]);

        $tx = $this->creditAction->execute(
            $member,
            50.00,
            LedgerEventType::COIN_DEPOSIT,
            'Deposit 50 EVO',
            'DEP-TEST-1',
            [],
            'manual_credit'
        );

        $this->assertEquals(150.00, (float) $member->fresh()->wallet_balance);
        $this->assertEquals(50.00, (float) $tx->amount);
        $this->assertEquals(100.00, (float) $tx->balance_before);
        $this->assertEquals(150.00, (float) $tx->balance_after);
        $this->assertEquals('manual_credit', $tx->channel);
        $this->assertEquals('EVO', $tx->currency);
    }

    public function test_debit_decreases_wallet_balance_and_records_negative_amount(): void
    {
        $member = Member::factory()->create(['wallet_balance' => 100.00]);

        $tx = $this->debitAction->execute(
            $member,
            40.00,
            LedgerEventType::PROMOTER_COMMISSION,
            'Purchase product',
            'PURCH-TEST-1',
            [],
            'store_purchase'
        );

        $this->assertEquals(60.00, (float) $member->fresh()->wallet_balance);
        $this->assertEquals(-40.00, (float) $tx->amount);
        $this->assertEquals(100.00, (float) $tx->balance_before);
        $this->assertEquals(60.00, (float) $tx->balance_after);
        $this->assertEquals('store_purchase', $tx->channel);
    }

    public function test_debit_fails_when_insufficient_balance(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $member = Member::factory()->create(['wallet_balance' => 20.00]);

        $this->debitAction->execute($member, 50.00, LedgerEventType::WALLET_WITHDRAWAL, 'Withdraw 50 EVO');
    }

    public function test_peer_to_peer_transfer_atomically_updates_both_wallets(): void
    {
        $sender = Member::factory()->create(['wallet_balance' => 200.00, 'member_code' => 'EVO-SENDER-1']);
        $recipient = Member::factory()->create(['wallet_balance' => 50.00, 'member_code' => 'EVO-RECIPIENT-2']);

        $result = $this->walletService->transfer($sender, 'EVO-RECIPIENT-2', 75.00, 'Project milestone payment');

        $this->assertEquals(125.00, (float) $sender->fresh()->wallet_balance);
        $this->assertEquals(125.00, (float) $recipient->fresh()->wallet_balance);
        $this->assertEquals(75.00, $result['amount_transferred']);
        $this->assertEquals(200.00, (float) $result['sender_balance_before']);
        $this->assertEquals(125.00, (float) $result['sender_balance_after']);
        $this->assertEquals(50.00, (float) $result['recipient_balance_before']);
        $this->assertEquals(125.00, (float) $result['recipient_balance_after']);
    }
}
