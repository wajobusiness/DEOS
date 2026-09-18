<?php

namespace Database\Seeders;

use App\Models\PaymentGatewaySetting;
use Illuminate\Database\Seeder;

class PlatformGatewaySeeder extends Seeder
{
    public function run(): void
    {
        PaymentGatewaySetting::updateOrCreate(
            ['gateway_key' => 'paystack'],
            [
                'name' => 'Paystack Online Card & Bank Gateway',
                'is_active' => env('PAYSTACK_ACTIVE', true),
                'is_test_mode' => env('PAYSTACK_TEST_MODE', true),
                'public_key' => env('PAYSTACK_PUBLIC_KEY', 'pk_test_30623bf1bf4479532883391d8e1c6670868f00fd'),
                'secret_key' => env('PAYSTACK_SECRET_KEY', 'sk_test_mock_paystack_secret_key_prod_env'),
                'ngn_exchange_rate' => env('PAYSTACK_NGN_RATE', 1550.00),
            ]
        );

        PaymentGatewaySetting::updateOrCreate(
            ['gateway_key' => 'cryptomus'],
            [
                'name' => 'Cryptomus USDT / Crypto Web3 Gateway',
                'is_active' => env('CRYPTOMUS_ACTIVE', true),
                'is_test_mode' => env('CRYPTOMUS_TEST_MODE', false),
                'public_key' => env('CRYPTOMUS_MERCHANT_ID', 'TNP4m28yK7aE9p4kLmZ1Qx9vB7dE8sT2rY'),
                'secret_key' => env('CRYPTOMUS_API_KEY', 'cryptomus_live_secret_key'),
            ]
        );

        PaymentGatewaySetting::updateOrCreate(
            ['gateway_key' => 'bank_transfer'],
            [
                'name' => 'Manual Bank Deposit & Wire Settlement',
                'is_active' => true,
                'is_test_mode' => false,
                'config_json' => [
                    'bankName' => env('BANK_NAME', 'Standard Chartered / Wema Bank'),
                    'accountName' => env('BANK_ACCOUNT_NAME', 'DEOS Sovereign Technologies Ltd'),
                    'accountNumber' => env('BANK_ACCOUNT_NUMBER', '0129849201'),
                    'sortCode' => env('BANK_SORT_CODE', '035150103'),
                ],
            ]
        );
    }
}
