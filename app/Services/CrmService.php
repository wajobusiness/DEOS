<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\Member;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CrmService
{
    public function getLeads(Member $member, ?string $stage = null, ?string $search = null): Collection
    {
        $query = Lead::where('member_id', $member->id);

        if ($stage && $stage !== 'All') {
            $query->where('stage', $stage);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%")
                  ->orWhere('company', 'ilike', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function createLead(Member $member, array $data): Lead
    {
        return Lead::create(array_merge($data, [
            'member_id' => $member->id,
            'status' => 'New',
            'stage' => $data['stage'] ?? 'Lead In',
            'score' => 75,
            'activity_log' => [
                [
                    'action' => 'Lead Created',
                    'timestamp' => now()->toIso8601String(),
                    'note' => 'Ingested from ' . ($data['source'] ?? 'Manual Entry'),
                ]
            ]
        ]));
    }

    public function updateStage(Lead $lead, string $newStage, ?float $dealValue = null): Lead
    {
        $log = $lead->activity_log ?? [];
        $log[] = [
            'action' => 'Stage Changed',
            'from' => $lead->stage,
            'to' => $newStage,
            'timestamp' => now()->toIso8601String(),
        ];

        $lead->stage = $newStage;
        if ($dealValue !== null) {
            $lead->deal_value = $dealValue;
        }
        $lead->activity_log = $log;
        $lead->save();

        return $lead;
    }
}
