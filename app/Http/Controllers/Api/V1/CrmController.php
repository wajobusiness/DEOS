<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Crm\LeadRequest;
use App\Http\Requests\Crm\UpdateLeadStageRequest;
use App\Models\Lead;
use App\Services\CrmService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrmController extends Controller
{
    public function __construct(protected CrmService $crmService) {}

    public function index(Request $request): JsonResponse
    {
        $leads = $this->crmService->getLeads(
            $request->user(),
            $request->query('stage'),
            $request->query('search')
        );

        return response()->json([
            'success' => true,
            'data' => $leads,
        ]);
    }

    public function store(LeadRequest $request): JsonResponse
    {
        $lead = $this->crmService->createLead($request->user(), $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully in your private CRM pipeline.',
            'data' => $lead,
        ], 201);
    }

    public function updateStage(UpdateLeadStageRequest $request, Lead $lead): JsonResponse
    {
        // Enforce tenant boundary
        if ($lead->member_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized lead access.'], 403);
        }

        $updated = $this->crmService->updateStage(
            $lead,
            $request->stage,
            $request->deal_value ? (float) $request->deal_value : null
        );

        return response()->json([
            'success' => true,
            'message' => 'Lead stage updated.',
            'data' => $updated,
        ]);
    }
}
