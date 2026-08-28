<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\WalletController;
use App\Http\Controllers\Api\V1\WebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public Authentication Endpoints
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public HMAC Verified Webhooks
    Route::post('/webhooks/paystack', [WebhookController::class, 'paystack'])
        ->middleware('webhook.signature:paystack');
    Route::post('/webhooks/cryptomus', [WebhookController::class, 'cryptomus']);

    // Authenticated Member Endpoints
    Route::middleware(['auth:sanctum', 'member.active'])->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Phase 2: Double-Entry Wallet & Financial Routing
        Route::get('/wallet/balance', [WalletController::class, 'balance']);
        Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
        Route::post('/wallet/deposit/initialize', [WalletController::class, 'initializeDeposit']);
        Route::post('/wallet/transfer', [WalletController::class, 'transfer']);
        Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);
    });
});
