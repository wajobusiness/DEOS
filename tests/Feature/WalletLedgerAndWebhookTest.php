<?php

namespace Tests\Feature;

use App\Actions\Wallet\CreditWalletAction;
use App\Actions\Wallet\DebitWalletAction;
use App\Actions\Wallet\RequestWithdrawalAction;
use App\Enums\LedgerEventType;
use App\Models\LedgerTransaction;
use App\Models\Member;
use App\Models\PaymentGatewaySetting;
use App\Models\WebhookEvent;
use App\Services\PaymentGatewayService;
use App\Services\WalletLedgerService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use Tests\TestCase;

class WalletLedgerAndWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected WalletLedgerService $walletService;
    protected PaymentGatewayService $gatewayService;
    protected CreditWalletAction $creditAction;
    protected DebitWalletAction $debitAction;

    protected function setUp(): void
    {
        parent::setUp();

        $this->creditAction = new CreditWalletAction();
        $this->debitAction = new DebitWalletAction();
        $withdrawalAction = new RequestWithdrawalAction($this->debitAction);

        $this->walletService = new WalletLedgerService(
            $this->creditAction,
            $this->debitAction,
            $withdrawalAction
        );

        $this->gatewayService = new PaymentGatewayService($this->creditAction);

        // Seed gateway settings for testing
        PaymentGatewaySetting::create([
            'gateway_key' => 'paystack',
            'name' => 'Paystack Online Gateway',
            'is_active' => true,
            'is_test_mode' => true,
            'public_key' => 'pk_test_mock_paystack',
            'secret_key' => 'sk_test_mock_paystack_secret_key',
            'ngn_exchange_rate' => 1550.00,
        ]);

        PaymentGatewaySetting::create([
            'gateway_key' => 'cryptomus',
            'name' => 'Cryptomus Gateway',
            'is_active' => true,
            'is_test_mode' => true,
            'public_key' => 'TNP4m28yK7aE9p4kLmZ1Qx9vB7dE8sT2rY',
            'secret_key' => 'mock_cryptomus_payment_api_key_123',
            'merchant_id' => 'mock_merchant_id_456',
        ]);
    }

    public function test_credit_action_records_balance_before_and_after_accurately(): void
    {
        $member = Member::factory()->create(['wallet_balance' => 100.00]);

        $tx = $this->creditAction->execute(
            $member,
            50.00,
            LedgerEventType::COIN_DEPOSIT,
            'Deposit 50 EVO',
            'DEP-001',
            ['channel' => 'paystack'],
            'paystack'
        );

        $this->assertEquals(150.00, (float) $member->fresh()->wallet_balance);
        $this->assertEquals(50.00, (float) $tx->amount);
        $this->assertEquals(100.00, (float) $tx->balance_before);
        $this->assertEquals(150.00, (float) $tx->balance_after);
        $this->assertEquals('paystack', $tx->channel);
    }

    public function test_debit_action_records_balance_before_and_after_and_fails_on_overdraft(): void
    {
        $member = Member::factory()->create(['wallet_balance' => 80.00]);

        $tx = $this->debitAction->execute(
            $member,
            30.00,
            LedgerEventType::WALLET_WITHDRAWAL,
            'Withdrawal 30 EVO',
            'WTH-001',
            [],
            'payout'
        );

        $this->assertEquals(50.00, (float) $member->fresh()->wallet_balance);
        $this->assertEquals(-30.00, (float) $tx->amount);
        $this->assertEquals(80.00, (float) $tx->balance_before);
        $this->assertEquals(50.00, (float) $tx->balance_after);

        $this->expectException(InvalidArgumentException::class);
        $this->debitAction->execute($member, 100.00, LedgerEventType::WALLET_WITHDRAWAL, 'Should fail');
    }

    public function test_peer_to_peer_transfer_atomically_balances_both_accounts(): void
    {
        $sender = Member::factory()->create([
            'wallet_balance' => 300.00,
            'member_code' => 'SENDER001',
            'email' => 'sender@eviona.com',
            'name' => 'Sender User',
        ]);

        $recipient = Member::factory()->create([
            'wallet_balance' => 50.00,
            'member_code' => 'REC002',
            'email' => 'rec@eviona.com',
            'name' => 'Recipient User',
        ]);

        $res = $this->walletService->transfer($sender, 'REC002', 120.00, 'Milestone settlement');

        $this->assertEquals(180.00, (float) $sender->fresh()->wallet_balance);
        $this->assertEquals(170.00, (float) $recipient->fresh()->wallet_balance);
        $this->assertEquals(120.00, $res['amount_transferred']);
        $this->assertEquals(300.00, (float) $res['sender_balance_before']);
        $this->assertEquals(180.00, (float) $res['sender_balance_after']);
        $this->assertEquals(50.00, (float) $res['recipient_balance_before']);
        $this->assertEquals(170.00, (float) $res['recipient_balance_after']);

        // Verify ledger entries
        $outTx = LedgerTransaction::where('reference_id', $res['correlation_id'] . '-OUT')->first();
        $inTx = LedgerTransaction::where('reference_id', $res['correlation_id'] . '-IN')->first();

        $this->assertNotNull($outTx);
        $this->assertNotNull($inTx);
        $this->assertEquals(-120.00, (float) $outTx->amount);
        $this->assertEquals(120.00, (float) $inTx->amount);
        $this->assertEquals('p2p_transfer', $outTx->channel);
        $this->assertEquals('p2p_transfer', $inTx->channel);
    }

    public function test_paystack_webhook_rejects_missing_or_invalid_hmac_signature(): void
    {
        $payload = [
            'event' => 'charge.success',
            'data' => [
                'id' => 999123,
                'reference' => 'PSTK-TEST-001',
                'amount' => 155000,
                'status' => 'success',
                'customer' => ['email' => 'test@eviona.com'],
            ]
        ];

        // 1. Missing signature -> 401
        $response = $this->postJson('/api/v1/webhooks/paystack', $payload);
        $response->assertStatus(401);

        // 2. Tampered signature -> 401
        $response = $this->postJson('/api/v1/webhooks/paystack', $payload, [
            'x-paystack-signature' => 'invalid_tampered_signature_string',
        ]);
        $response->assertStatus(401);
    }

    public function test_paystack_webhook_processes_valid_signature_and_credits_member(): void
    {
        $member = Member::factory()->create([
            'email' => 'investor@eviona.com',
            'wallet_balance' => 0.00,
        ]);

        $payload = [
            'event' => 'charge.success',
            'data' => [
                'id' => 881290,
                'reference' => 'DEP-PAYSTACK-TEST-001',
                'amount' => 15500000, // 155,000 NGN in kobo = 100 USD @ 1550 rate
                'status' => 'success',
                'currency' => 'NGN',
                'channel' => 'card',
                'customer' => [
                    'email' => 'investor@eviona.com',
                ],
                'metadata' => [
                    'member_id' => $member->id,
                    'amount_usd' => 100.00,
                ],
            ]
        ];

        $rawBody = json_encode($payload);
        $secretKey = 'sk_test_mock_paystack_secret_key';
        $signature = hash_hmac('sha512', $rawBody, $secretKey);

        $response = $this->call('POST', '/api/v1/webhooks/paystack', [], [], [], [
            'HTTP_X_PAYSTACK_SIGNATURE' => $signature,
            'CONTENT_TYPE' => 'application/json',
        ], $rawBody);

        $response->assertStatus(200);
        $this->assertEquals(100.00, (float) $member->fresh()->wallet_balance);

        // Verify ledger entry
        $ledger = LedgerTransaction::where('reference_id', 'DEP-PAYSTACK-TEST-001')->first();
        $this->assertNotNull($ledger);
        $this->assertEquals(100.00, (float) $ledger->amount);
        $this->assertEquals('paystack', $ledger->channel);

        // Verify WebhookEvent recorded
        $event = WebhookEvent::where('gateway', 'paystack')
            ->where('event_id', '881290')
            ->first();
        $this->assertNotNull($event);
        $this->assertEquals('processed', $event->status);
    }

    public function test_paystack_webhook_idempotency_prevents_duplicate_credits(): void
    {
        $member = Member::factory()->create([
            'email' => 'investor2@eviona.com',
            'wallet_balance' => 0.00,
        ]);

        $payload = [
            'event' => 'charge.success',
            'data' => [
                'id' => 771234,
                'reference' => 'DEP-PAYSTACK-DEDUP-001',
                'amount' => 7750000,
                'status' => 'success',
                'customer' => ['email' => 'investor2@eviona.com'],
                'metadata' => [
                    'member_id' => $member->id,
                    'amount_usd' => 50.00,
                ],
            ]
        ];

        $rawBody = json_encode($payload);
        $signature = hash_hmac('sha512', $rawBody, 'sk_test_mock_paystack_secret_key');

        // First attempt
        $res1 = $this->call('POST', '/api/v1/webhooks/paystack', [], [], [], [
            'HTTP_X_PAYSTACK_SIGNATURE' => $signature,
            'CONTENT_TYPE' => 'application/json',
        ], $rawBody);
        $res1->assertStatus(200);
        $this->assertEquals(50.00, (float) $member->fresh()->wallet_balance);

        // Second attempt (replay attack / network retry)
        $res2 = $this->call('POST', '/api/v1/webhooks/paystack', [], [], [], [
            'HTTP_X_PAYSTACK_SIGNATURE' => $signature,
            'CONTENT_TYPE' => 'application/json',
        ], $rawBody);
        $res2->assertStatus(200);

        // Balance MUST still be exactly 50.00, NOT 100.00!
        $this->assertEquals(50.00, (float) $member->fresh()->wallet_balance);
    }

    public function test_cryptomus_webhook_validates_signature_and_credits_on_paid_status(): void
    {
        $member = Member::factory()->create([
            'email' => 'cryptouser@eviona.com',
            'wallet_balance' => 25.00,
        ]);

        $dataWithoutSign = [
            'type' => 'payment',
            'uuid' => 'cm-uuid-999-1234',
            'order_id' => 'DEP-CRYPTO-TEST-777',
            'amount' => '100.00',
            'merchant_amount' => '100.00',
            'payment_amount' => '100.00',
            'payer_currency' => 'USDT',
            'currency' => 'USD',
            'status' => 'paid',
            'is_final' => true,
            'txid' => '0x992384a89fb1234857ef',
            'address' => 'TNP4m28yK7aE9p4kLmZ1Qx9vB7dE8sT2rY',
            'network' => 'tron',
            'additional_data' => json_encode(['member_id' => $member->id]),
        ];

        $apiKey = 'mock_cryptomus_payment_api_key_123';
        $sign = md5(base64_encode(json_encode($dataWithoutSign, JSON_UNESCAPED_UNICODE)) . $apiKey);

        $payload = array_merge($dataWithoutSign, ['sign' => $sign]);

        $response = $this->postJson('/api/v1/webhooks/cryptomus', $payload);
        $response->assertStatus(200);

        // Verify wallet updated: 25.00 + 100.00 = 125.00
        $this->assertEquals(125.00, (float) $member->fresh()->wallet_balance);

        // Verify ledger transaction
        $ledger = LedgerTransaction::where('reference_id', 'DEP-CRYPTO-TEST-777')->first();
        $this->assertNotNull($ledger);
        $this->assertEquals(100.00, (float) $ledger->amount);
        $this->assertEquals('cryptomus', $ledger->channel);
        $this->assertEquals('tron', $ledger->metadata['network']);
        $this->assertEquals('0x992384a89fb1234857ef', $ledger->metadata['txid']);

        // Verify WebhookEvent
        $event = WebhookEvent::where('gateway', 'cryptomus')
            ->where('event_id', 'cm-uuid-999-1234')
            ->first();
        $this->assertNotNull($event);
        $this->assertEquals('processed', $event->status);
    }

    public function test_cryptomus_webhook_idempotency_prevents_replay(): void
    {
        $member = Member::factory()->create([
            'email' => 'cryptouser2@eviona.com',
            'wallet_balance' => 0.00,
        ]);

        $dataWithoutSign = [
            'type' => 'payment',
            'uuid' => 'cm-uuid-replay-test-555',
            'order_id' => 'DEP-CRYPTO-REPLAY-888',
            'amount' => '75.00',
            'merchant_amount' => '75.00',
            'payment_amount' => '75.00',
            'payer_currency' => 'USDT',
            'currency' => 'USD',
            'status' => 'paid',
            'is_final' => true,
            'txid' => '0xaaa111222333444',
            'additional_data' => json_encode(['member_id' => $member->id]),
        ];

        $apiKey = 'mock_cryptomus_payment_api_key_123';
        $sign = md5(base64_encode(json_encode($dataWithoutSign, JSON_UNESCAPED_UNICODE)) . $apiKey);
        $payload = array_merge($dataWithoutSign, ['sign' => $sign]);

        // Attempt 1
        $res1 = $this->postJson('/api/v1/webhooks/cryptomus', $payload);
        $res1->assertStatus(200);
        $this->assertEquals(75.00, (float) $member->fresh()->wallet_balance);

        // Attempt 2 (replay)
        $res2 = $this->postJson('/api/v1/webhooks/cryptomus', $payload);
        $res2->assertStatus(200);

        // Balance MUST remain exactly 75.00
        $this->assertEquals(75.00, (float) $member->fresh()->wallet_balance);
    }

    public function test_cryptomus_webhook_records_non_paid_states_without_crediting_funds(): void
    {
        $member = Member::factory()->create([
            'email' => 'cryptouser3@eviona.com',
            'wallet_balance' => 50.00,
        ]);

        $dataWithoutSign = [
            'type' => 'payment',
            'uuid' => 'cm-uuid-pending-process',
            'order_id' => 'DEP-CRYPTO-PROCESS-999',
            'amount' => '200.00',
            'status' => 'process',
            'is_final' => false,
            'additional_data' => json_encode(['member_id' => $member->id]),
        ];

        $apiKey = 'mock_cryptomus_payment_api_key_123';
        $sign = md5(base64_encode(json_encode($dataWithoutSign, JSON_UNESCAPED_UNICODE)) . $apiKey);
        $payload = array_merge($dataWithoutSign, ['sign' => $sign]);

        $response = $this->postJson('/api/v1/webhooks/cryptomus', $payload);
        $response->assertStatus(200);

        // Balance MUST NOT increase
        $this->assertEquals(50.00, (float) $member->fresh()->wallet_balance);

        // Webhook event recorded as 'process'
        $event = WebhookEvent::where('gateway', 'cryptomus')
            ->where('event_id', 'cm-uuid-pending-process')
            ->first();
        $this->assertNotNull($event);
        $this->assertEquals('process', $event->status);
    }
}

