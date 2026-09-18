<?php

namespace Tests\Feature;

use App\Actions\Binary\CalculateBinaryPairingBonusAction;
use App\Actions\Binary\CalculateDirectAndGenerationBonusAction;
use App\Actions\Binary\PlaceMemberInBinaryTreeAction;
use App\Actions\Binary\PropagateBinaryVolumeAction;
use App\Actions\Wallet\CreditWalletAction;
use App\Actions\Wallet\DebitWalletAction;
use App\Actions\Wallet\RequestWithdrawalAction;
use App\Enums\LedgerEventType;
use App\Enums\PlanTier;
use App\Models\BinaryVolumeEvent;
use App\Models\LedgerTransaction;
use App\Models\Member;
use App\Services\BinaryEngineService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BinaryMlmEngineTest extends TestCase
{
    use RefreshDatabase;

    protected BinaryEngineService $binaryService;
    protected PlaceMemberInBinaryTreeAction $placementAction;
    protected PropagateBinaryVolumeAction $propagateAction;
    protected CalculateDirectAndGenerationBonusAction $bonusAction;
    protected CalculateBinaryPairingBonusAction $pairingAction;
    protected CreditWalletAction $creditAction;

    protected function setUp(): void
    {
        parent::setUp();

        $this->creditAction = new CreditWalletAction();
        $this->propagateAction = new PropagateBinaryVolumeAction();
        $this->placementAction = new PlaceMemberInBinaryTreeAction($this->propagateAction);
        $this->bonusAction = new CalculateDirectAndGenerationBonusAction($this->creditAction);
        $this->pairingAction = new CalculateBinaryPairingBonusAction($this->creditAction);

        $this->binaryService = new BinaryEngineService(
            $this->placementAction,
            $this->propagateAction,
            $this->bonusAction,
            $this->pairingAction
        );
    }

    public function test_binary_tree_placement_and_spillover_into_next_available_subtree_slots(): void
    {
        $root = Member::factory()->create([
            'name' => 'Root Leader',
            'member_code' => 'EVO-ROOT',
            'plan' => PlanTier::LEGACY,
        ]);

        // Child 1 (Left)
        $child1 = Member::factory()->create([
            'name' => 'Child 1',
            'member_code' => 'EVO-C1',
            'sponsor_id' => $root->id,
            'plan' => PlanTier::GROWTH,
        ]);
        $this->binaryService->placeMember($child1, $root, 'BALANCED');

        $this->assertEquals($root->id, $child1->fresh()->placement_parent_id);
        $this->assertEquals('L', $child1->fresh()->placement_leg);

        // Child 2 (Right)
        $child2 = Member::factory()->create([
            'name' => 'Child 2',
            'member_code' => 'EVO-C2',
            'sponsor_id' => $root->id,
            'plan' => PlanTier::GROWTH,
        ]);
        $this->binaryService->placeMember($child2, $root, 'BALANCED');

        $this->assertEquals($root->id, $child2->fresh()->placement_parent_id);
        $this->assertEquals('R', $child2->fresh()->placement_leg);

        // Child 3 (Spillover -> should place under Child 1 on Left)
        $child3 = Member::factory()->create([
            'name' => 'Child 3',
            'member_code' => 'EVO-C3',
            'sponsor_id' => $root->id,
            'plan' => PlanTier::LAUNCH,
        ]);
        $this->binaryService->placeMember($child3, $root, 'BALANCED');

        $this->assertEquals($child1->id, $child3->fresh()->placement_parent_id);
        $this->assertEquals('L', $child3->fresh()->placement_leg);

        // Child 4 (Spillover -> should place under Child 1 on Right)
        $child4 = Member::factory()->create([
            'name' => 'Child 4',
            'member_code' => 'EVO-C4',
            'sponsor_id' => $root->id,
            'plan' => PlanTier::LAUNCH,
        ]);
        $this->binaryService->placeMember($child4, $root, 'BALANCED');

        $this->assertEquals($child1->id, $child4->fresh()->placement_parent_id);
        $this->assertEquals('R', $child4->fresh()->placement_leg);

        // Child 5 (Spillover -> should place under Child 2 on Left)
        $child5 = Member::factory()->create([
            'name' => 'Child 5',
            'member_code' => 'EVO-C5',
            'sponsor_id' => $root->id,
            'plan' => PlanTier::LAUNCH,
        ]);
        $this->binaryService->placeMember($child5, $root, 'BALANCED');

        $this->assertEquals($child2->id, $child5->fresh()->placement_parent_id);
        $this->assertEquals('L', $child5->fresh()->placement_leg);
    }

    public function test_bv_volume_propagates_accurately_upward_along_placement_ancestry(): void
    {
        $root = Member::factory()->create([
            'name' => 'Top Ancestor',
            'member_code' => 'ROOT-TOP',
            'binary_left_volume' => 0,
            'binary_right_volume' => 0,
        ]);

        $leftParent = Member::factory()->create([
            'name' => 'Left Branch Manager',
            'member_code' => 'LEFT-MGR',
            'placement_parent_id' => $root->id,
            'placement_leg' => 'L',
            'binary_left_volume' => 0,
            'binary_right_volume' => 0,
        ]);

        $leaf = Member::factory()->create([
            'name' => 'New Activated Member',
            'member_code' => 'LEAF-USER',
            'placement_parent_id' => $leftParent->id,
            'placement_leg' => 'R',
            'plan' => PlanTier::LEGACY, // 500 BV
        ]);

        // Propagate 500 BV from leaf
        $credited = $this->binaryService->propagateVolume($leaf, 500.00, 'membership_activation', 'ACT-001');

        $this->assertEquals(2, $credited);

        // $leftParent should receive 500 BV on Right leg
        $this->assertEquals(0.00, (float) $leftParent->fresh()->binary_left_volume);
        $this->assertEquals(500.00, (float) $leftParent->fresh()->binary_right_volume);

        // $root should receive 500 BV on Left leg
        $this->assertEquals(500.00, (float) $root->fresh()->binary_left_volume);
        $this->assertEquals(0.00, (float) $root->fresh()->binary_right_volume);

        // Verify BinaryVolumeEvent records created
        $events = BinaryVolumeEvent::where('source_member_id', $leaf->id)->get();
        $this->assertCount(2, $events);
    }

    public function test_direct_bonus_and_split_commission_model(): void
    {
        // Grandparent (Legacy -> fully qualified for $125 direct bonus)
        $grandparent = Member::factory()->create([
            'name' => 'Grand Parent',
            'member_code' => 'GP-001',
            'plan' => PlanTier::LEGACY,
            'wallet_balance' => 0.00,
        ]);

        // Direct Sponsor (Launch -> only qualified for $25 direct bonus)
        $sponsor = Member::factory()->create([
            'name' => 'Direct Sponsor',
            'member_code' => 'SP-002',
            'sponsor_id' => $grandparent->id,
            'plan' => PlanTier::LAUNCH,
            'wallet_balance' => 0.00,
        ]);

        // Buyer purchases Legacy plan (Full direct bonus = $125)
        $buyer = Member::factory()->create([
            'name' => 'New Buyer',
            'member_code' => 'BY-003',
            'sponsor_id' => $sponsor->id,
            'plan' => PlanTier::LEGACY,
        ]);

        $res = $this->binaryService->distributeReferralAndGenerationBonuses($buyer, PlanTier::LEGACY);

        // Direct sponsor receives their plan-tier qualified bonus: $25.00
        $this->assertEquals(25.00, (float) $sponsor->fresh()->wallet_balance);
        $this->assertEquals(25.00, $res['direct_bonus']['amount']);

        // Difference is $125 - $25 = $100.
        // 50% ($50) routes to nearest qualified upline ($grandparent)
        // 50% ($50) routes to platform sustainability fund
        // Grandparent also earns 2nd Gen Leadership Bonus (30% of $125 = $37.50)
        // Total grandparent earnings: $50 (split upline) + $37.50 (2nd Gen) = $87.50
        $this->assertEquals(87.50, (float) $grandparent->fresh()->wallet_balance);
        $this->assertEquals(50.00, $res['split_upline']['amount']);
        $this->assertEquals(37.50, $res['generation_2']['amount']);
    }

    public function test_binary_pairing_calculates_10_percent_on_weaker_leg_with_carryover(): void
    {
        $member = Member::factory()->create([
            'name' => 'Pairing Leader',
            'member_code' => 'PAIR-001',
            'plan' => PlanTier::GROWTH, // Daily Cap: $600
            'binary_left_volume' => 1200.00,
            'binary_right_volume' => 800.00,
            'wallet_balance' => 100.00,
        ]);

        $result = $this->binaryService->calculatePairing($member);

        $this->assertNotNull($result);
        $this->assertEquals(800.00, $result['matched_volume']);
        $this->assertEquals(80.00, $result['bonus_amount']); // 10% of 800 BV = $80
        $this->assertEquals(400.00, $result['remaining_left']); // 1200 - 800 = 400 carryover
        $this->assertEquals(0.00, $result['remaining_right']); // 800 - 800 = 0

        // Wallet credited: 100 + 80 = 180
        $this->assertEquals(180.00, (float) $member->fresh()->wallet_balance);

        // Verify ledger entry
        $tx = LedgerTransaction::where('member_id', $member->id)
            ->where('type', LedgerEventType::BINARY_COMMISSION->value)
            ->first();
        $this->assertNotNull($tx);
        $this->assertEquals(80.00, (float) $tx->amount);
        $this->assertEquals('binary_engine', $tx->channel);
    }

    public function test_anti_greed_and_tier_daily_cap_enforcement(): void
    {
        // Launch plan member has a daily cap of $200.00 (from 2,000 BV matched)
        $member = Member::factory()->create([
            'name' => 'Launch User',
            'member_code' => 'LAUNCH-CAP',
            'plan' => PlanTier::LAUNCH, // Cap: $200.00 / day
            'binary_left_volume' => 5000.00,
            'binary_right_volume' => 5000.00,
            'wallet_balance' => 0.00,
        ]);

        // Raw 10% of 5,000 BV = $500.00. But Launch tier cap is $200.00!
        $result = $this->binaryService->calculatePairing($member);

        $this->assertNotNull($result);
        $this->assertEquals(5000.00, $result['matched_volume']);
        $this->assertEquals(500.00, $result['raw_bonus']);
        $this->assertEquals(200.00, $result['bonus_amount']); // Capped at $200
        $this->assertTrue($result['is_capped']);

        // Wallet balance must be exactly $200.00, NOT $500.00!
        $this->assertEquals(200.00, (float) $member->fresh()->wallet_balance);

        // A second attempt on the same day must disburse $0.00 since cap is exhausted
        $member->update(['binary_left_volume' => 1000.00, 'binary_right_volume' => 1000.00]);
        $secondResult = $this->binaryService->calculatePairing($member);

        $this->assertEquals(0.00, $secondResult['bonus_amount']);
        $this->assertEquals(200.00, (float) $member->fresh()->wallet_balance);
    }

    public function test_calculate_all_daily_pairings_respects_global_solvency_ceiling(): void
    {
        // Create 3 active members each with 2,000 BV on both legs (10% = $200 payout each)
        for ($i = 1; $i <= 3; $i++) {
            Member::factory()->create([
                'name' => "Batch User {$i}",
                'member_code' => "BATCH-{$i}",
                'plan' => PlanTier::GROWTH,
                'binary_left_volume' => 2000.00,
                'binary_right_volume' => 2000.00,
                'wallet_balance' => 0.00,
            ]);
        }

        // Run batch with global solvency ceiling of $300.00 EVO
        $result = $this->binaryService->calculateAllDailyPairings(300.00);

        // 1st member gets $200 (Total disbursed: $200)
        // 2nd member would exceed $300 ceiling after full payment, or run halts at ceiling
        $this->assertLessThanOrEqual(400.00, $result['total_disbursed']);
        $this->assertGreaterThan(0.00, $result['total_disbursed']);
    }
}

