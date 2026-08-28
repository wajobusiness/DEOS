<?php

namespace App\Actions\Marketplace;

use App\Actions\Wallet\CreditWalletAction;
use App\Actions\Wallet\DebitWalletAction;
use App\Enums\LedgerEventType;
use App\Enums\OrderStatus;
use App\Enums\PaymentRail;
use App\Models\MarketplaceOrder;
use App\Models\MarketplaceOrderItem;
use App\Models\Member;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ExecuteProductPurchaseAction
{
    public function __construct(
        protected CreditWalletAction $creditAction,
        protected DebitWalletAction $debitAction
    ) {}

    public function execute(Product $product, array $data, ?Member $buyerMember = null): MarketplaceOrder
    {
        return DB::transaction(function () use ($product, $data, $buyerMember) {
            $totalAmount = (float) $product->price;
            $platformFee = $totalAmount * 0.10; // 10% platform fee
            $promoterCommission = 0.00;
            $uplineOverride = 0.00;

            $promoter = null;
            if (!empty($data['promoter_code'])) {
                $promoter = Member::with('sponsor')->where('member_code', $data['promoter_code'])->first();
                if ($promoter) {
                    $rate = (float) $product->affiliate_commission_rate; // e.g. 0.40 (40%)
                    $promoterCommission = $totalAmount * $rate;

                    // 5% 2nd Tier Upline Override if sponsor exists
                    if ($promoter->sponsor) {
                        $uplineOverride = $totalAmount * 0.05;
                    }
                }
            }

            $sellerPayout = $totalAmount - $platformFee - $promoterCommission - $uplineOverride;
            $orderNumber = 'ORD-' . strtoupper(Str::random(8));
            $licenseKey = 'LIC-' . strtoupper(Str::random(4) . '-' . Str::random(4) . '-' . Str::random(4));

            // If buyer paid via wallet, deduct immediately
            $paymentRail = PaymentRail::from($data['payment_rail']);
            if ($paymentRail === PaymentRail::WALLET && $buyerMember) {
                $this->debitAction->execute(
                    $buyerMember,
                    $totalAmount,
                    LedgerEventType::PROMOTER_COMMISSION,
                    "Purchased digital product: {$product->title} (Order: {$orderNumber})"
                );
            }

            // Create Order
            $order = MarketplaceOrder::create([
                'order_number' => $orderNumber,
                'buyer_member_id' => $buyerMember?->id,
                'buyer_name' => $data['buyer_name'],
                'buyer_email' => strtolower(trim($data['buyer_email'])),
                'promoter_member_id' => $promoter?->id,
                'total_amount' => $totalAmount,
                'platform_fee' => $platformFee,
                'promoter_commission' => $promoterCommission,
                'upline_override' => $uplineOverride,
                'seller_payout' => $sellerPayout,
                'payment_method' => $paymentRail->value,
                'payment_rail' => $paymentRail,
                'status' => OrderStatus::PAID,
                'license_key' => $licenseKey,
            ]);

            MarketplaceOrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'price' => $totalAmount,
                'quantity' => 1,
            ]);

            // Credit Seller Royalty
            $seller = Member::find($product->seller_id);
            if ($seller) {
                $this->creditAction->execute(
                    $seller,
                    $sellerPayout,
                    LedgerEventType::SELLER_PAYOUT,
                    "Product Sale Royalty: {$product->title} (Order: {$orderNumber})",
                    $orderNumber
                );
            }

            // Credit Affiliate Commission
            if ($promoter && $promoterCommission > 0) {
                $this->creditAction->execute(
                    $promoter,
                    $promoterCommission,
                    LedgerEventType::PROMOTER_COMMISSION,
                    "Direct Affiliate Commission for {$product->title} (Order: {$orderNumber})",
                    $orderNumber
                );

                // Credit Upline Override
                if ($promoter->sponsor && $uplineOverride > 0) {
                    $this->creditAction->execute(
                        $promoter->sponsor,
                        $uplineOverride,
                        LedgerEventType::PRODUCT_SALE_UPLINE_OVERRIDE,
                        "2nd Tier 5% Affiliate Override for {$product->title} via {$promoter->name}",
                        $orderNumber
                    );
                }
            }

            $product->increment('sales_count');

            return $order;
        });
    }
}
