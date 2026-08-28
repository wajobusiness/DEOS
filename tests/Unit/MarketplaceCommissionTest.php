<?php

namespace Tests\Unit;

use App\Actions\Marketplace\ExecuteProductPurchaseAction;
use App\Actions\Wallet\CreditWalletAction;
use App\Actions\Wallet\DebitWalletAction;
use App\Enums\OrderStatus;
use App\Enums\PaymentRail;
use App\Models\Member;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketplaceCommissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_checkout_distributes_40_percent_affiliate_and_5_percent_upline_override(): void
    {
        $seller = Member::factory()->create(['wallet_balance' => 0.00]);
        $sponsor = Member::factory()->create(['wallet_balance' => 0.00]);
        $promoter = Member::factory()->create(['wallet_balance' => 0.00, 'sponsor_id' => $sponsor->id, 'member_code' => 'EVO-AFF-01']);

        $product = Product::factory()->create([
            'seller_id' => $seller->id,
            'price' => 100.00,
            'affiliate_commission_rate' => 0.40,
        ]);

        $credit = new CreditWalletAction();
        $debit = new DebitWalletAction();
        $action = new ExecuteProductPurchaseAction($credit, $debit);

        $order = $action->execute($product, [
            'buyer_name' => 'John Customer',
            'buyer_email' => 'john@customer.com',
            'promoter_code' => 'EVO-AFF-01',
            'payment_rail' => PaymentRail::PAYSTACK->value,
        ]);

        $this->assertEquals(OrderStatus::PAID, $order->status);
        $this->assertEquals(100.00, $order->total_amount);
        $this->assertEquals(10.00, $order->platform_fee); // 10%
        $this->assertEquals(40.00, $order->promoter_commission); // 40%
        $this->assertEquals(5.00, $order->upline_override); // 5% 2nd tier
        $this->assertEquals(45.00, $order->seller_payout); // 100 - 10 - 40 - 5 = $45

        // Verify wallet credits
        $this->assertEquals(45.00, $seller->fresh()->wallet_balance);
        $this->assertEquals(40.00, $promoter->fresh()->wallet_balance);
        $this->assertEquals(5.00, $sponsor->fresh()->wallet_balance);
    }
}
