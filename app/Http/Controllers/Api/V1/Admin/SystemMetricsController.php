<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\PlatformSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemMetricsController extends Controller
{
    public function __construct(protected PlatformSettingsService $settingsService) {}

    public function index(): JsonResponse
    {
        $metrics = $this->settingsService->getSystemMetrics();

        return response()->json([
            'success' => true,
            'data' => $metrics,
        ]);
    }
}
