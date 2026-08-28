<?php

namespace App\Actions\Binary;

use App\Models\Member;
use Illuminate\Support\Facades\DB;

class PlaceMemberInBinaryTreeAction
{
    public function execute(Member $newMember, Member $sponsor, string $preferredLeg = 'AUTO'): Member
    {
        return DB::transaction(function () use ($newMember, $sponsor, $preferredLeg) {
            $parentNode = $sponsor;
            $leg = $preferredLeg;

            if ($leg === 'AUTO') {
                // Auto balance to weaker volume leg
                $leg = ($sponsor->binary_left_volume <= $sponsor->binary_right_volume) ? 'L' : 'R';
            }

            // Traverse down the extreme leg to find placement leaf
            while (true) {
                $child = Member::where('placement_parent_id', $parentNode->id)
                    ->where('placement_leg', $leg)
                    ->first();

                if (!$child) {
                    break;
                }
                $parentNode = $child;
            }

            $newMember->placement_parent_id = $parentNode->id;
            $newMember->placement_leg = $leg;
            $newMember->save();

            // Bubble up business volume (e.g. 50 BV for Launch, 150 BV for Growth, 300 BV for Legacy)
            $volume = $newMember->plan->binaryVolume();
            $this->propagateVolumeUpward($newMember, $volume);

            return $newMember;
        });
    }

    protected function propagateVolumeUpward(Member $member, float $volume): void
    {
        $current = $member;
        while ($current->placement_parent_id) {
            $parent = Member::find($current->placement_parent_id);
            if (!$parent) break;

            if ($current->placement_leg === 'L') {
                $parent->increment('binary_left_volume', $volume);
            } else {
                $parent->increment('binary_right_volume', $volume);
            }

            $current = $parent;
        }
    }
}
