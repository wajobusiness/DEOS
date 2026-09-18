<?php

namespace App\Actions\Binary;

use App\Models\BinaryVolumeEvent;
use App\Models\Member;
use Illuminate\Support\Facades\DB;

class PropagateBinaryVolumeAction
{
    public function execute(
        Member $sourceMember,
        float $volume,
        string $sourceType = 'membership_activation',
        ?string $sourceReference = null,
        array $metadata = []
    ): int {
        if ($volume <= 0) {
            return 0;
        }

        return DB::transaction(function () use ($sourceMember, $volume, $sourceType, $sourceReference, $metadata) {
            $creditedCount = 0;
            $current = $sourceMember;
            $incomingLeg = $sourceMember->placement_leg;

            while (!empty($current->placement_parent_id)) {
                $parent = Member::where('id', $current->placement_parent_id)->lockForUpdate()->first();
                if (!$parent) {
                    break;
                }

                if ($incomingLeg === 'L') {
                    $parent->binary_left_volume += $volume;
                } elseif ($incomingLeg === 'R') {
                    $parent->binary_right_volume += $volume;
                }

                $parent->save();

                BinaryVolumeEvent::create([
                    'member_id' => $parent->id,
                    'source_member_id' => $sourceMember->id,
                    'bv_amount' => $volume,
                    'leg' => $incomingLeg ?? 'L',
                    'source_type' => $sourceType,
                    'source_reference' => $sourceReference,
                    'left_volume_after' => $parent->binary_left_volume,
                    'right_volume_after' => $parent->binary_right_volume,
                    'metadata' => array_merge($metadata, [
                        'source_member_code' => $sourceMember->member_code,
                        'source_member_name' => $sourceMember->name,
                        'source_plan' => $sourceMember->plan->value,
                    ]),
                ]);

                $creditedCount++;
                $incomingLeg = $parent->placement_leg;
                $current = $parent;
            }

            return $creditedCount;
        });
    }
}
