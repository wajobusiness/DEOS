<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\MarketingCapiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MarketingController extends Controller
{
    public function __construct(protected MarketingCapiService $marketingService) {}

    public function getPixels(Request $request): JsonResponse
    {
        $pixels = $this->marketingService->getPixels($request->user());

        return response()->json([
            'success' => true,
            'data' => $pixels,
        ]);
    }

    public function updatePixels(Request $request): JsonResponse
    {
        $pixels = $this->marketingService->updatePixels($request->user(), $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Pixel configuration saved and synchronized with server CAPI.',
            'data' => $pixels,
        ]);
    }

    public function createCampaign(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'channel' => ['required', 'string', 'max:64'],
            'target_url' => ['required', 'url'],
            'utm_source' => ['required', 'string', 'max:128'],
            'utm_medium' => ['required', 'string', 'max:128'],
            'utm_campaign' => ['required', 'string', 'max:128'],
        ]);

        $campaign = $this->marketingService->createCampaign($request->user(), $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Tracked marketing campaign URL generated.',
            'data' => $campaign,
        ], 201);
    }
}
