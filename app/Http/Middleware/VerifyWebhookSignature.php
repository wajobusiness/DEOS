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
            $secret = $setting?->secret_key ?: config('services.paystack.secret_key');

            if (empty($signature) || empty($secret)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing Paystack signature header or gateway secret key configuration'
                ], 401);
            }

            $computed = hash_hmac('sha512', $request->getContent(), $secret);

            if (!hash_equals($computed, (string) $signature)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Paystack webhook signature'
                ], 401);
            }
        } elseif ($gateway === 'cryptomus') {
            $data = $request->all();
            $sign = $data['sign'] ?? $request->header('sign') ?? '';
            $setting = PaymentGatewaySetting::where('gateway_key', 'cryptomus')->first();
            $apiKey = $setting?->secret_key ?: config('services.cryptomus.payment_key');

            if (empty($sign) || empty($apiKey)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Missing Cryptomus signature parameter or API key configuration'
                ], 401);
            }

            unset($data['sign']);
            $computed = md5(base64_encode(json_encode($data, JSON_UNESCAPED_UNICODE)) . $apiKey);

            if (!hash_equals($computed, (string) $sign)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Cryptomus webhook signature'
                ], 401);
            }
        }

        return $next($request);
    }
}
