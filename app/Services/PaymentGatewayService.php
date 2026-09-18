<?php

namespace App\Services;

use App\Actions\Wallet\CreditWalletAction;
use App\Enums\LedgerEventType;
use App\Enums\PaymentRail;
use App\Models\LedgerTransaction;
use App\Models\Member;
use App\Models\PaymentGatewaySetting;
use App\Models\WebhookEvent;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentGatewayService
{
    public function __construct(protected CreditWalletAction $creditAction) {}

    public function initializeDeposit(Member $member, float $amount, PaymentRail $rail): array
    {
        $reference = 'DEP-' . strtoupper(Str::random(10));

        if ($rail === PaymentRail::PAYSTACK) {
            $setting = PaymentGatewaySetting::where('gateway_key', 'paystack')->first();
            $rate = (float) ($setting?->ngn_exchange_rate ?? config('services.paystack.ngn_exchange_rate', 1550.00));
            $amountKobo = (int) round($amount * $rate * 100);

            return [
                'payment_rail' => PaymentRail::PAYSTACK->value,
                'reference' => $reference,
                'public_key' => $setting?->public_key ?? config('services.paystack.public_key'),
                'amount_usd' => $amount,
                'amount_ngn_kobo' => $amountKobo,
                'ngn_exchange_rate' => $rate,
                'email' => $member->email,
                'customer_name' => $member->name,
                'metadata' => [
                    'member_id' => $member->id,
                    'amount_usd' => $amount,
                    'custom_fields' => [
                        [
                            'display_name' => 'Member Code',
                            'variable_name' => 'member_code',
                            'value' => $member->member_code,
                        ]
                    ]
                ]
            ];
        }

        if ($rail === PaymentRail::CRYPTO_USDT) {
            $setting = PaymentGatewaySetting::where('gateway_key', 'cryptomus')->first();

            return [
                'payment_rail' => PaymentRail::CRYPTO_USDT->value,
                'reference' => $reference,
                'amount_usdt' => $amount,
                'network' => 'TRC20',
                'deposit_address' => $setting?->public_key ?? 'TNP4m28yK7aE9p4kLmZ1Qx9vB7dE8sT2rY',
                'merchant_id' => $setting?->merchant_id ?? config('services.cryptomus.merchant_id'),
                'instructions' => 'Send exact USDT (TRC20) to the address provided. Automatic confirmation in ~2 minutes.',
                'metadata' => [
                    'member_id' => $member->id,
                    'amount' => $amount,
                ]
            ];
        }

        if ($rail === PaymentRail::BANK_TRANSFER) {
            $setting = PaymentGatewaySetting::where('gateway_key', 'bank_transfer')->first();

            return [
                'payment_rail' => PaymentRail::BANK_TRANSFER->value,
                'reference' => $reference,
                'amount_usd' => $amount,
                'bank_details' => $setting?->config_json ?? [
                    'bankName' => 'Standard Chartered / Wema Bank',
                    'accountName' => 'DEOS Sovereign Technologies Ltd',
                    'accountNumber' => '0129849201',
                ],
                'instructions' => 'Transfer exact funds with reference code in payment remarks and upload receipt.',
            ];
        }

        return ['reference' => $reference];
    }

    public function handlePaystackWebhook(array $payload, ?string $ipAddress = null): array
    {
        $event = $payload['event'] ?? '';
        $data = $payload['data'] ?? [];
        $eventId = (string) ($data['id'] ?? $data['reference'] ?? Str::uuid());
        $reference = (string) ($data['reference'] ?? '');

        if ($event !== 'charge.success') {
            WebhookEvent::firstOrCreate(
                ['gateway' => 'paystack', 'event_id' => $eventId],
                [
                    'event_type' => $event,
                    'reference' => $reference,
                    'status' => 'ignored',
                    'payload' => $payload,
                    'ip_address' => $ipAddress,
                    'processed_at' => now(),
                ]
            );

            return ['status' => 'ignored', 'event' => $event];
        }

        // 1. Idempotency Guard: Check if event or reference has already been executed
        $existingEvent = WebhookEvent::where('gateway', 'paystack')
            ->where('event_id', $eventId)
            ->where('status', 'processed')
            ->first();

        if ($existingEvent) {
            return [
                'status' => 'duplicate',
                'message' => 'Event already processed',
                'reference' => $reference,
            ];
        }

        $existingLedger = LedgerTransaction::where('reference_id', $reference)->first();
        if ($existingLedger) {
            WebhookEvent::firstOrCreate(
                ['gateway' => 'paystack', 'event_id' => $eventId],
                [
                    'event_type' => $event,
                    'reference' => $reference,
                    'status' => 'duplicate',
                    'payload' => $payload,
                    'ip_address' => $ipAddress,
                    'processed_at' => now(),
                ]
            );

            return [
                'status' => 'duplicate',
                'message' => 'Transaction reference already credited in ledger',
                'reference' => $reference,
            ];
        }

        // 2. Server-to-Server Verification (when configured with real secret key)
        $setting = PaymentGatewaySetting::where('gateway_key', 'paystack')->first();
        $secret = $setting?->secret_key ?: config('services.paystack.secret_key');
        $rate = (float) ($setting?->ngn_exchange_rate ?? config('services.paystack.ngn_exchange_rate', 1550.00));

        $verifiedData = $data;
        if (!empty($secret) && !app()->environment('testing') && !str_starts_with($secret, 'sk_test_mock')) {
            try {
                $response = Http::withToken($secret)
                    ->timeout(10)
                    ->get("https://api.paystack.co/transaction/verify/{$reference}");

                if ($response->successful() && $response->json('status') === true) {
                    $verifiedData = $response->json('data');
                }
            } catch (\Throwable $e) {
                Log::warning("Paystack server-to-server verification failed for {$reference}: " . $e->getMessage());
            }
        }

        if (($verifiedData['status'] ?? '') !== 'success') {
            WebhookEvent::create([
                'gateway' => 'paystack',
                'event_id' => $eventId,
                'event_type' => $event,
                'reference' => $reference,
                'status' => 'failed',
                'payload' => $payload,
                'ip_address' => $ipAddress,
                'processed_at' => now(),
            ]);

            return ['status' => 'failed', 'message' => 'Verification indicates uncompleted transaction'];
        }

        // 3. Extract Amount and Resolve Member
        $email = $verifiedData['customer']['email'] ?? null;
        $metadata = $verifiedData['metadata'] ?? [];
        $memberId = $metadata['member_id'] ?? null;

        $amountUSD = isset($metadata['amount_usd']) && (float) $metadata['amount_usd'] > 0
            ? (float) $metadata['amount_usd']
            : (float) (($verifiedData['amount'] ?? 0) / 100 / $rate);

        $member = null;
        if ($memberId) {
            $member = Member::find($memberId);
        }
        if (!$member && $email) {
            $member = Member::where('email', strtolower(trim($email)))->first();
        }

        if (!$member) {
            WebhookEvent::create([
                'gateway' => 'paystack',
                'event_id' => $eventId,
                'event_type' => $event,
                'reference' => $reference,
                'status' => 'unresolved_member',
                'payload' => $payload,
                'ip_address' => $ipAddress,
                'processed_at' => now(),
            ]);

            return ['status' => 'error', 'message' => 'No member matched payment email/ID'];
        }

        // 4. Atomic Credit and Audit Logging inside DB Transaction
        return DB::transaction(function () use ($member, $amountUSD, $reference, $eventId, $event, $payload, $verifiedData, $ipAddress) {
            $tx = $this->creditAction->execute(
                $member,
                $amountUSD,
                LedgerEventType::COIN_DEPOSIT,
                "Paystack Online Card Deposit (Ref: {$reference})",
                $reference,
                [
                    'gateway' => 'paystack',
                    'event_id' => $eventId,
                    'channel' => $verifiedData['channel'] ?? 'card',
                    'currency' => $verifiedData['currency'] ?? 'NGN',
                    'kobo_amount' => $verifiedData['amount'] ?? null,
                    'paid_at' => $verifiedData['paid_at'] ?? now()->toISOString(),
                    'gateway_response' => $verifiedData['gateway_response'] ?? null,
                ],
                'paystack'
            );

            WebhookEvent::create([
                'gateway' => 'paystack',
                'event_id' => $eventId,
                'event_type' => $event,
                'reference' => $reference,
                'status' => 'processed',
                'payload' => $payload,
                'ip_address' => $ipAddress,
                'processed_at' => now(),
            ]);

            return [
                'status' => 'success',
                'reference' => $reference,
                'amount_credited' => $amountUSD,
                'ledger_id' => $tx->id,
            ];
        });
    }

    public function handleCryptomusWebhook(array $payload, ?string $ipAddress = null): array
    {
        $uuid = (string) ($payload['uuid'] ?? Str::uuid());
        $orderId = (string) ($payload['order_id'] ?? '');
        $status = strtolower((string) ($payload['status'] ?? ''));
        $eventType = $payload['type'] ?? 'payment';

        // 1. Idempotency Check
        $existingEvent = WebhookEvent::where('gateway', 'cryptomus')
            ->where('event_id', $uuid)
            ->where('status', 'processed')
            ->first();

        if ($existingEvent) {
            return [
                'status' => 'duplicate',
                'message' => 'Cryptomus event already processed',
                'uuid' => $uuid,
                'order_id' => $orderId,
            ];
        }

        if (!empty($orderId)) {
            $existingLedger = LedgerTransaction::where('reference_id', $orderId)->first();
            if ($existingLedger) {
                WebhookEvent::firstOrCreate(
                    ['gateway' => 'cryptomus', 'event_id' => $uuid],
                    [
                        'event_type' => $eventType,
                        'reference' => $orderId,
                        'status' => 'duplicate',
                        'payload' => $payload,
                        'ip_address' => $ipAddress,
                        'processed_at' => now(),
                    ]
                );

                return [
                    'status' => 'duplicate',
                    'message' => 'Order reference already credited in ledger',
                    'order_id' => $orderId,
                ];
            }
        }

        // 2. Handle Crypto States: paid, paid_over, wrong_amount, process, cancel
        if (in_array($status, ['paid', 'paid_over'], true)) {
            $merchantAmount = (float) ($payload['merchant_amount'] ?? $payload['amount'] ?? 0);

            // Extract additional data metadata if present
            $additionalData = [];
            if (!empty($payload['additional_data'])) {
                if (is_string($payload['additional_data'])) {
                    $decoded = json_decode($payload['additional_data'], true);
                    $additionalData = is_array($decoded) ? $decoded : ['raw' => $payload['additional_data']];
                } elseif (is_array($payload['additional_data'])) {
                    $additionalData = $payload['additional_data'];
                }
            }

            $memberId = $additionalData['member_id'] ?? null;
            $memberEmail = $additionalData['email'] ?? $additionalData['user_email'] ?? null;

            $member = null;
            if ($memberId) {
                $member = Member::find($memberId);
            }
            if (!$member && $memberEmail) {
                $member = Member::where('email', strtolower(trim($memberEmail)))->first();
            }

            if (!$member) {
                WebhookEvent::create([
                    'gateway' => 'cryptomus',
                    'event_id' => $uuid,
                    'event_type' => $eventType,
                    'reference' => $orderId,
                    'status' => 'unresolved_member',
                    'payload' => $payload,
                    'ip_address' => $ipAddress,
                    'processed_at' => now(),
                ]);

                return ['status' => 'error', 'message' => 'No member resolved for crypto payment'];
            }

            return DB::transaction(function () use ($member, $merchantAmount, $orderId, $uuid, $status, $eventType, $payload, $ipAddress) {
                $ref = !empty($orderId) ? $orderId : ('CRYPTO-' . strtoupper(Str::random(10)));

                $tx = $this->creditAction->execute(
                    $member,
                    $merchantAmount,
                    LedgerEventType::COIN_DEPOSIT,
                    "Cryptomus USDT Deposit (Ref: {$ref}, Status: {$status})",
                    $ref,
                    [
                        'gateway' => 'cryptomus',
                        'uuid' => $uuid,
                        'txid' => $payload['txid'] ?? null,
                        'address' => $payload['address'] ?? null,
                        'network' => $payload['network'] ?? 'TRC20',
                        'payer_currency' => $payload['payer_currency'] ?? 'USDT',
                        'payer_amount' => $payload['payment_amount'] ?? null,
                        'merchant_amount' => $merchantAmount,
                        'status' => $status,
                        'is_final' => $payload['is_final'] ?? true,
                    ],
                    'cryptomus'
                );

                WebhookEvent::create([
                    'gateway' => 'cryptomus',
                    'event_id' => $uuid,
                    'event_type' => $eventType,
                    'reference' => $ref,
                    'status' => 'processed',
                    'payload' => $payload,
                    'ip_address' => $ipAddress,
                    'processed_at' => now(),
                ]);

                return [
                    'status' => 'success',
                    'reference' => $ref,
                    'amount_credited' => $merchantAmount,
                    'ledger_id' => $tx->id,
                ];
            });
        }

        // Record other states (process, wrong_amount, cancel, fail)
        WebhookEvent::create([
            'gateway' => 'cryptomus',
            'event_id' => $uuid,
            'event_type' => $eventType,
            'reference' => $orderId,
            'status' => $status,
            'payload' => $payload,
            'ip_address' => $ipAddress,
            'processed_at' => now(),
        ]);

        return [
            'status' => $status,
            'message' => "Cryptomus state [{$status}] recorded without credit",
            'uuid' => $uuid,
        ];
    }
}
