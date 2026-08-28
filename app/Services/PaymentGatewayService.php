<?php

namespace App\Services;

use App\Actions\Wallet\CreditWalletAction;
use App\Enums\LedgerEventType;
use App\Enums\PaymentRail;
use App\Models\Member;
use App\Models\PaymentGatewaySetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentGatewayService
{
    public function __construct(protected CreditWalletAction $creditAction) {}

    public function initializeDeposit(Member $member, float $amount, PaymentRail $rail): array
    {
        $reference = 'DEP-' . strtoupper(Str::random(10));

        if ($rail === PaymentRail::PAYSTACK) {
            $setting = PaymentGatewaySetting::where('gateway_key', 'paystack')->first();
            $rate = $setting?->ngn_exchange_rate ?? 1550.00;
            $amountKobo = (int) round($amount * $rate * 100);

            return [
                'payment_rail' => PaymentRail::PAYSTACK->value,
                'reference' => $reference,
                'public_key' => $setting?->public_key,
                'amount_usd' => $amount,
                'amount_ngn_kobo' => $amountKobo,
                'ngn_exchange_rate' => $rate,
                'email' => $member->email,
                'customer_name' => $member->name,
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
                'instructions' => 'Send exact USDT (TRC20) to the address provided. Automatic confirmation in ~2 minutes.',
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

    public function handlePaystackWebhook(array $payload): void
    {
        $event = $payload['event'] ?? '';
        if ($event !== 'charge.success') return;

        $data = $payload['data'] ?? [];
        $email = $data['customer']['email'] ?? null;
        $amountUSD = (float) ($data['metadata']['amount_usd'] ?? ($data['amount'] / 100 / 1550));
        $reference = $data['reference'] ?? ('PSTK-' . Str::random(10));

        $member = Member::where('email', strtolower(trim($email)))->first();
        if ($member) {
            $this->creditAction->execute(
                $member,
                $amountUSD,
                LedgerEventType::COIN_DEPOSIT,
                "Paystack Online Card Deposit (Ref: {$reference})",
                $reference,
                ['gateway' => 'paystack', 'gateway_response' => $data]
            );
        }
    }
}
