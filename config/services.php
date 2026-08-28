<?php

return [
    'paystack' => [
        'public_key' => env('PAYSTACK_PUBLIC_KEY', 'pk_test_30623bf1bf4479532883391d8e1c6670868f00fd'),
        'secret_key' => env('PAYSTACK_SECRET_KEY', 'sk_test_paystack_secret_key_prod_env'),
        'ngn_exchange_rate' => env('PAYSTACK_NGN_RATE', 1550.00),
    ],
    'cryptomus' => [
        'merchant_id' => env('CRYPTOMUS_MERCHANT_ID', ''),
        'payment_key' => env('CRYPTOMUS_PAYMENT_KEY', ''),
    ],
    'scraper' => [
        'url' => env('SCRAPER_DAEMON_URL', 'http://127.0.0.1:8080'),
    ],
];
