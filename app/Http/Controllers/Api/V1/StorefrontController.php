<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\StorefrontService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StorefrontController extends Controller
{
    public function __construct(protected StorefrontService $storeService) {}

    public function show(string $slugOrDomain): JsonResponse
    {
        $data = $this->storeService->getStoreBySlugOrDomain($slugOrDomain);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $updated = $this->storeService->updateStore($request->user(), $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Storefront updated and synchronized with DNS routing.',
            'data' => $updated,
        ]);
    }
}
