<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\LeadScraperService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadFinderController extends Controller
{
    public function __construct(protected LeadScraperService $scraperService) {}

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query' => ['required', 'string'],
            'location' => ['required', 'string'],
            'limit' => ['nullable', 'integer', 'max:50'],
        ]);

        $results = $this->scraperService->searchPlaces(
            $request->query('query'),
            $request->query('location'),
            (int) $request->query('limit', 20)
        );

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }

    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'businessName' => ['required', 'string'],
            'email' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'category' => ['nullable', 'string'],
            'location' => ['nullable', 'string'],
        ]);

        $lead = $this->scraperService->importToCrm($request->user(), $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Lead imported directly into your private CRM pipeline.',
            'data' => $lead,
        ], 201);
    }
}
