<?php

namespace App\Enums;

enum LedgerEventType: string
{
    case DIRECT_REFERRAL_BONUS = 'direct_referral_bonus';
    case BINARY_COMMISSION = 'binary_commission';
    case GENERATION_BONUS = 'generation_bonus';
    case SPLIT_COMMISSION_PLATFORM = 'split_commission_platform';
    case SPLIT_COMMISSION_UPLINE = 'split_commission_upline';
    case PLATFORM_TRANSACTION_FEE = 'platform_transaction_fee';
    case PROMOTER_COMMISSION = 'promoter_commission';
    case PRODUCT_SALE_UPLINE_OVERRIDE = 'product_sale_upline_override';
    case DIRECT_SALE_UPLINE_BONUS = 'direct_sale_upline_bonus';
    case SELLER_PAYOUT = 'seller_payout';
    case ACADEMY_INSTRUCTOR_REVENUE = 'academy_instructor_revenue';
    case COIN_DEPOSIT = 'coin_deposit';
    case COIN_CONVERSION = 'coin_conversion';
    case WALLET_WITHDRAWAL = 'wallet_withdrawal';
    case WALLET_TRANSFER_IN = 'wallet_transfer_in';
    case WALLET_TRANSFER_OUT = 'wallet_transfer_out';
}
