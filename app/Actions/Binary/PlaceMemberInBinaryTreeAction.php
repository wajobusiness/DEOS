<?php

namespace App\Actions\Binary;

use App\Models\Member;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class PlaceMemberInBinaryTreeAction
{
    public function __construct(protected PropagateBinaryVolumeAction $propagateAction) {}

    public function execute(
        Member $newMember,
        Member $sponsor,
        string $placementStrategy = 'AUTO',
        ?string $explicitParentId = null,
        ?string $explicitLeg = null
    ): Member {
        return DB::transaction(function () use ($newMember, $sponsor, $placementStrategy, $explicitParentId, $explicitLeg) {
            $targetParent = null;
            $targetLeg = null;

            if ($explicitParentId && $explicitLeg) {
                $targetParent = Member::where('id', $explicitParentId)->lockForUpdate()->firstOrFail();
                $targetLeg = strtoupper(trim($explicitLeg));

                if (!in_array($targetLeg, ['L', 'R'], true)) {
                    throw new InvalidArgumentException("Invalid placement leg '{$targetLeg}'. Must be 'L' or 'R'.");
                }

                $occupied = Member::where('placement_parent_id', $targetParent->id)
                    ->where('placement_leg', $targetLeg)
                    ->exists();

                if ($occupied) {
                    throw new InvalidArgumentException("Placement slot {$targetLeg} on parent {$targetParent->member_code} is already occupied.");
                }
            } else {
                [$targetParent, $targetLeg] = $this->findPlacementSlot($sponsor, $placementStrategy);
            }

            // Lock parent row for concurrency safety
            $lockedParent = Member::where('id', $targetParent->id)->lockForUpdate()->firstOrFail();

            // Double check slot occupancy inside row lock
            $isOccupied = Member::where('placement_parent_id', $lockedParent->id)
                ->where('placement_leg', $targetLeg)
                ->exists();

            if ($isOccupied) {
                // If occupied due to concurrent placement, fallback to find next available slot
                [$lockedParent, $targetLeg] = $this->findPlacementSlot($sponsor, $placementStrategy);
            }

            $newMember->placement_parent_id = $lockedParent->id;
            $newMember->placement_leg = $targetLeg;
            $newMember->save();

            // Propagate BV volume up the placement tree
            $volume = $newMember->plan->binaryVolume();
            if ($volume > 0) {
                $this->propagateAction->execute(
                    $newMember,
                    $volume,
                    'membership_activation',
                    "Membership Activation: {$newMember->member_code} ({$newMember->plan->value})"
                );
            }

            return $newMember->fresh();
        });
    }

    public function findPlacementSlot(Member $sponsor, string $strategy): array
    {
        $strategy = strtoupper(trim($strategy));

        if ($strategy === 'EXTREME_LEFT' || $strategy === 'L') {
            return $this->findExtremeLeaf($sponsor, 'L');
        }

        if ($strategy === 'EXTREME_RIGHT' || $strategy === 'R') {
            return $this->findExtremeLeaf($sponsor, 'R');
        }

        if ($strategy === 'AUTO' || $strategy === 'WEAK_LEG') {
            $preferredLeg = ((float) $sponsor->binary_left_volume <= (float) $sponsor->binary_right_volume) ? 'L' : 'R';
            $directChild = Member::where('placement_parent_id', $sponsor->id)->where('placement_leg', $preferredLeg)->first();
            if (!$directChild) {
                return [$sponsor, $preferredLeg];
            }
            return $this->findBreadthFirstSlot($directChild);
        }

        // Default 'BALANCED': Breadth-first search starting from sponsor
        return $this->findBreadthFirstSlot($sponsor);
    }

    protected function findExtremeLeaf(Member $startNode, string $leg): array
    {
        $current = $startNode;
        while (true) {
            $child = Member::where('placement_parent_id', $current->id)
                ->where('placement_leg', $leg)
                ->first();

            if (!$child) {
                return [$current, $leg];
            }
            $current = $child;
        }
    }

    protected function findBreadthFirstSlot(Member $startNode): array
    {
        $queue = [$startNode];

        while (!empty($queue)) {
            $node = array_shift($queue);

            $leftChild = Member::where('placement_parent_id', $node->id)->where('placement_leg', 'L')->first();
            if (!$leftChild) {
                return [$node, 'L'];
            }

            $rightChild = Member::where('placement_parent_id', $node->id)->where('placement_leg', 'R')->first();
            if (!$rightChild) {
                return [$node, 'R'];
            }

            $queue[] = $leftChild;
            $queue[] = $rightChild;
        }

        return [$startNode, 'L'];
    }
}
