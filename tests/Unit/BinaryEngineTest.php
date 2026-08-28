<?php

namespace Tests\Unit;

use App\Actions\Binary\CalculateBinaryPairingBonusAction;
use App\Actions\Binary\PlaceMemberInBinaryTreeAction;
use App\Actions\Wallet\CreditWalletAction;
use App\Enums\PlanTier;
use App\Models\Member;
use App\Services\BinaryEngineService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BinaryEngineTest extends TestCase
{
    use RefreshDatabase;

    public function test_binary_pairing_calculates_10_percent_on_weaker_leg_volume(): void
    {
        $member = Member::factory()->create([
            'binary_left_volume' => 1000.00,
            'binary_right_volume' => 600.00,
            'wallet_balance' => 0.00,
        ]);

        $credit = new CreditWalletAction();
        $pairingAction = new CalculateBinaryPairingBonusAction($credit);

        $result = $pairingAction->execute($member);

        $this->assertNotNull($result);
        $this->assertEquals(600.00, $result['matched_volume']);
        $this->assertEquals(60.00, $result['bonus_amount']); // 10% of 600 BV = $60
        $this->assertEquals(400.00, $result['remaining_left']); // 1000 - 600 = 400 BV carryover
        $this->assertEquals(0.00, $result['remaining_right']); // 600 - 600 = 0 BV
        $this->assertEquals(60.00, $member->fresh()->wallet_balance);
    }
}
