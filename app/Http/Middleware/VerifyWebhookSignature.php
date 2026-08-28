<?php

namespace App\Http\Middleware;

use App\Models\PaymentGatewaySetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyWebhookSignature
{
    public function handle(Request $request, Closure $next, string $gateway): Response
    {
        if ($gateway === 'paystack') {
            $signature = $request->header('x-paystack-signature');
            $setting = PaymentGatewaySetting::where('gateway_key', 'paystack')->first();
            $secret = $setting?->secret_key ?? config('services.paystack.secret_key');

            if (!$signature || !$secret || hash_hmac('sha512', $request->getContent(), $secret) !== $signature) {
                return response()->json(['message' => 'Invalid Paystack webhook signature'], 401);
            }
        }

        return $next($request);
    }
}
