<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BinaryController;
use App\Http\Controllers\Api\V1\CrmController;
use App\Http\Controllers\Api\V1\MarketplaceController;
use App\Http\Controllers\Api\V1\StorefrontController;
use App\Http\Controllers\Api\V1\WalletController;
use App\Http\Controllers\Api\V1\WebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public Authentication Endpoints
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Public Marketplace & Storefront Discovery
    Route::get('/marketplace/products', [MarketplaceController::class, 'index']);
    Route::get('/marketplace/products/{slug}', [MarketplaceController::class, 'show']);
    Route::post('/marketplace/checkout', [MarketplaceController::class, 'checkout']);
    Route::get('/storefront/{slugOrDomain}', [StorefrontController::class, 'show']);

    // Public HMAC Verified Webhooks
    Route::post('/webhooks/paystack', [WebhookController::class, 'paystack']);
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

        // Phase 3: Business Modules (CRM, Storefront, Binary MLM)
        Route::get('/crm/leads', [CrmController::class, 'index']);
        Route::post('/crm/leads', [CrmController::class, 'store']);
        Route::put('/crm/leads/{lead}/stage', [CrmController::class, 'updateStage']);

        Route::put('/storefront', [StorefrontController::class, 'update']);

        Route::get('/binary/tree', [BinaryController::class, 'tree']);
        Route::post('/binary/pairing/calculate', [BinaryController::class, 'triggerPairing']);
    });
});
