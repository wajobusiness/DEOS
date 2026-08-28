<?php

namespace App\Enums;

enum PaymentRail: string
{
    case PAYSTACK = 'paystack';
    case CRYPTO_USDT = 'crypto_usdt';
    case WALLET = 'wallet';
    case BANK_TRANSFER = 'bank_transfer';
    case STRIPE = 'stripe';
}
