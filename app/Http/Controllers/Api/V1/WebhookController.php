<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\PaymentGatewayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class WebhookController extends Controller
{
    public function __construct(protected PaymentGatewayService $gatewayService) {}

    public function paystack(Request $request): JsonResponse
    {
        try {
            $result = $this->gatewayService->handlePaystackWebhook($request->all(), $request->ip());

            return response()->json([
                'success' => true,
                'result' => $result,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function cryptomus(Request $request): JsonResponse
    {
        try {
            $result = $this->gatewayService->handleCryptomusWebhook($request->all(), $request->ip());

            return response()->json([
                'success' => true,
                'result' => $result,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
