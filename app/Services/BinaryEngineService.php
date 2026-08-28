<?php

namespace App\Services;

use App\Actions\Binary\CalculateBinaryPairingBonusAction;
use App\Actions\Binary\PlaceMemberInBinaryTreeAction;
use App\Models\Member;

class BinaryEngineService
{
    public function __construct(
        protected PlaceMemberInBinaryTreeAction $placementAction,
        protected CalculateBinaryPairingBonusAction $pairingAction
    ) {}

    public function getTree(Member $rootMember, int $depth = 3): array
    {
        return $this->buildTreeNode($rootMember, $depth);
    }

    protected function buildTreeNode(Member $member, int $remainingDepth): array
    {
        $node = [
            'id' => $member->id,
            'member_code' => $member->member_code,
            'name' => $member->name,
            'plan' => $member->plan->value,
            'rank' => $member->rank,
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

    public function calculatePairing(Member $member): ?array
    {
        return $this->pairingAction->execute($member);
    }
}
