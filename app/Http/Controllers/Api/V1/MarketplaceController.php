<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Marketplace\CheckoutRequest;
use App\Services\MarketplaceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MarketplaceController extends Controller
{
    public function __construct(protected MarketplaceService $marketService) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->marketService->getProducts($request->query('category'));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = $this->marketService->getProductBySlug($slug);

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $order = $this->marketService->checkout($request->validated(), $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Purchase completed successfully. License key generated and commissions distributed.',
            'data' => $order->load('items.product'),
        ], 201);
    }
}
