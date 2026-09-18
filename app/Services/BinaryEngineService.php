<?php

namespace App\Services;

use App\Actions\Binary\CalculateBinaryPairingBonusAction;
use App\Actions\Binary\CalculateDirectAndGenerationBonusAction;
use App\Actions\Binary\PlaceMemberInBinaryTreeAction;
use App\Actions\Binary\PropagateBinaryVolumeAction;
use App\Enums\MemberStatus;
use App\Enums\PlanTier;
use App\Models\Member;
use Illuminate\Support\Facades\DB;

class BinaryEngineService
{
    public function __construct(
        protected PlaceMemberInBinaryTreeAction $placementAction,
        protected PropagateBinaryVolumeAction $propagateAction,
        protected CalculateDirectAndGenerationBonusAction $bonusAction,
        protected CalculateBinaryPairingBonusAction $pairingAction
    ) {}

    public function placeMember(
        Member $newMember,
        Member $sponsor,
        string $preferredLeg = 'AUTO',
        ?string $targetParentId = null,
        ?string $targetLeg = null
    ): Member {
        return $this->placementAction->execute($newMember, $sponsor, $preferredLeg, $targetParentId, $targetLeg);
    }

    public function propagateVolume(
        Member $sourceMember,
        float $volume,
        string $sourceType = 'membership_activation',
        ?string $sourceReference = null,
        array $metadata = []
    ): int {
        return $this->propagateAction->execute($sourceMember, $volume, $sourceType, $sourceReference, $metadata);
    }

    public function distributeReferralAndGenerationBonuses(Member $buyer, PlanTier $purchasedPlan): array
    {
        return $this->bonusAction->execute($buyer, $purchasedPlan);
    }

    public function calculatePairing(Member $member): ?array
    {
        return $this->pairingAction->execute($member);
    }

    public function calculateAllDailyPairings(float $maxGlobalPayoutLimit = 100000.00): array
    {
        $eligibleMembers = Member::where('status', MemberStatus::ACTIVE->value)
            ->where('binary_left_volume', '>', 0)
            ->where('binary_right_volume', '>', 0)
            ->orderBy('created_at', 'asc')
            ->get();

        $processedCount = 0;
        $totalMatchedVolume = 0.0;
        $totalDisbursed = 0.0;
        $results = [];

        foreach ($eligibleMembers as $member) {
            // Global solvency safety check
            if ($totalDisbursed >= $maxGlobalPayoutLimit) {
                break;
            }

            $res = $this->pairingAction->execute($member);
            if ($res && $res['matched_volume'] > 0) {
                $processedCount++;
                $totalMatchedVolume += $res['matched_volume'];
                $totalDisbursed += $res['bonus_amount'];
                $results[] = $res;
            }
        }

        return [
            'members_matched' => $processedCount,
            'total_volume_matched' => $totalMatchedVolume,
            'total_disbursed' => $totalDisbursed,
            'details' => $results,
        ];
    }

    public function getTree(Member $rootMember, int $depth = 3): array
    {
        return $this->buildTreeNode($rootMember, $depth);
    }

    public function getDownlineStats(Member $member): array
    {
        $leftStats = $this->getLegSubtreeStats($member, 'L');
        $rightStats = $this->getLegSubtreeStats($member, 'R');

        return [
            'total_network_count' => $leftStats['count'] + $rightStats['count'],
            'left_leg' => [
                'count' => $leftStats['count'],
                'current_volume' => (float) $member->binary_left_volume,
                'total_accumulated_volume' => $leftStats['total_volume'],
            ],
            'right_leg' => [
                'count' => $rightStats['count'],
                'current_volume' => (float) $member->binary_right_volume,
                'total_accumulated_volume' => $rightStats['total_volume'],
            ],
            'weaker_leg' => (float) $member->binary_left_volume <= (float) $member->binary_right_volume ? 'Left' : 'Right',
            'matching_potential' => min((float) $member->binary_left_volume, (float) $member->binary_right_volume) * 0.10,
        ];
    }

    protected function getLegSubtreeStats(Member $parent, string $leg): array
    {
        $child = Member::where('placement_parent_id', $parent->id)->where('placement_leg', $leg)->first();
        if (!$child) {
            return ['count' => 0, 'total_volume' => 0.0];
        }

        $queue = [$child];
        $count = 0;
        $totalVol = 0.0;

        while (!empty($queue)) {
            $node = array_shift($queue);
            $count++;
            $totalVol += (float) ($node->plan->binaryVolume() ?? 0);

            $children = Member::where('placement_parent_id', $node->id)->get();
            foreach ($children as $c) {
                $queue[] = $c;
            }
        }

        return ['count' => $count, 'total_volume' => $totalVol];
    }

    public function getAncestryPath(Member $member, string $treeType = 'placement'): array
    {
        $path = [];
        $current = $member;

        while (true) {
            $parentId = ($treeType === 'sponsor') ? $current->sponsor_id : $current->placement_parent_id;
            if (!$parentId) {
                break;
            }

            $parent = Member::find($parentId);
            if (!$parent) {
                break;
            }

            $path[] = [
                'id' => $parent->id,
                'member_code' => $parent->member_code,
                'name' => $parent->name,
                'plan' => $parent->plan->value,
                'leg' => ($treeType === 'placement') ? $current->placement_leg : null,
            ];

            $current = $parent;
        }

        return $path;
    }

    protected function buildTreeNode(Member $member, int $remainingDepth): array
    {
        $node = [
            'id' => $member->id,
            'member_code' => $member->member_code,
            'name' => $member->name,
            'plan' => $member->plan->value,
            'rank' => $member->rank ?? 'Member',
            'status' => $member->status->value,
            'left_volume' => (float) $member->binary_left_volume,
            'right_volume' => (float) $member->binary_right_volume,
            'left_child' => null,
            'right_child' => null,
        ];

        if ($remainingDepth > 0) {
            $leftChild = Member::where('placement_parent_id', $member->id)->where('placement_leg', 'L')->first();
            $rightChild = Member::where('placement_parent_id', $member->id)->where('placement_leg', 'R')->first();

            if ($leftChild) {
                $node['left_child'] = $this->buildTreeNode($leftChild, $remainingDepth - 1);
            }
            if ($rightChild) {
                $node['right_child'] = $this->buildTreeNode($rightChild, $remainingDepth - 1);
            }
        }

        return $node;
    }
}
