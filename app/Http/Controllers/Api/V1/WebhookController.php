<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\PaymentGatewayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function __construct(protected PaymentGatewayService $gatewayService) {}

    public function paystack(Request $request): JsonResponse
    {
        $this->gatewayService->handlePaystackWebhook($request->all());

        return response()->json(['status' => 'success']);
    }

    public function cryptomus(Request $request): JsonResponse
    {
        // Cryptomus webhook receiver
        return response()->json(['status' => 'success']);
    }
}
