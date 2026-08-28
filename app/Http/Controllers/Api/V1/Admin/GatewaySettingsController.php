<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\PlatformSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GatewaySettingsController extends Controller
{
    public function __construct(protected PlatformSettingsService $settingsService) {}

    public function index(): JsonResponse
    {
        $gateways = $this->settingsService->getGateways();

        return response()->json([
            'success' => true,
            'data' => $gateways,
        ]);
    }

    public function update(Request $request, string $gatewayKey): JsonResponse
    {
        $updated = $this->settingsService->updateGateway(
            $gatewayKey,
            $request->all(),
            $request->user()
        );

        return response()->json([
            'success' => true,
            'message' => "Gateway {$gatewayKey} settings updated.",
            'data' => $updated,
        ]);
    }
}
