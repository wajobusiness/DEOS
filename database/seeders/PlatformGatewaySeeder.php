<?php

namespace Database\Seeders;

use App\Models\PaymentGatewaySetting;
use Illuminate\Database\Seeder;

class PlatformGatewaySeeder extends Seeder
{
    public function run(): void
    {
        PaymentGatewaySetting::firstOrCreate(
            ['gateway_key' => 'paystack'],
            [
                'name' => 'Paystack Online Card & Bank Gateway',
                'is_active' => true,
                'is_test_mode' => true,
                'public_key' => 'pk_test_30623bf1bf4479532883391d8e1c6670868f00fd',
                'secret_key' => 'sk_test_mock_paystack_secret_key_prod_env',
                'ngn_exchange_rate' => 1550.00,
            ]
        );

        PaymentGatewaySetting::firstOrCreate(
            ['gateway_key' => 'cryptomus'],
            [
                'name' => 'Cryptomus USDT / Crypto Web3 Gateway',
                'is_active' => true,
                'is_test_mode' => false,
                'public_key' => 'TNP4m28yK7aE9p4kLmZ1Qx9vB7dE8sT2rY',
                'secret_key' => 'cryptomus_live_secret_key',
            ]
        );

        PaymentGatewaySetting::firstOrCreate(
            ['gateway_key' => 'bank_transfer'],
            [
                'name' => 'Manual Bank Deposit & Wire Settlement',
                'is_active' => true,
                'is_test_mode' => false,
                'config_json' => [
                    'bankName' => 'Standard Chartered / Wema Bank',
                    'accountName' => 'DEOS Sovereign Technologies Ltd',
                    'accountNumber' => '0129849201',
                    'sortCode' => '035150103',
                ],
            ]
        );
    }
}
