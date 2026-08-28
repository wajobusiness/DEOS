<?php

use App\Http\Controllers\Api\V1\AcademyController;
use App\Http\Controllers\Api\V1\Admin\GatewaySettingsController;
use App\Http\Controllers\Api\V1\Admin\SystemMetricsController;
use App\Http\Controllers\Api\V1\Admin\WithdrawalApprovalController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BinaryController;
use App\Http\Controllers\Api\V1\CrmController;
use App\Http\Controllers\Api\V1\LeadFinderController;
use App\Http\Controllers\Api\V1\MarketingController;
use App\Http\Controllers\Api\V1\MarketplaceController;
use App\Http\Controllers\Api\V1\StorefrontController;
use App\Http\Controllers\Api\V1\WalletController;
use App\Http\Controllers\Api\V1\WebinarController;
use App\Http\Controllers\Api\V1\WebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware(['throttle:60,1'])->group(function () {
    // Public Rate-Limited Authentication Endpoints (6 attempts/min)
    Route::middleware(['throttle:6,1'])->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
        Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    });

    // Public Marketplace & Storefront Discovery
    Route::get('/marketplace/products', [MarketplaceController::class, 'index']);
    Route::get('/marketplace/products/{slug}', [MarketplaceController::class, 'show']);
    Route::post('/marketplace/checkout', [MarketplaceController::class, 'checkout']);
    Route::get('/storefront/{slugOrDomain}', [StorefrontController::class, 'show']);

    // Public Webinars & Academy
    Route::get('/webinars', [WebinarController::class, 'index']);
    Route::get('/webinars/{slug}', [WebinarController::class, 'show']);
    Route::post('/webinars/{webinar}/register', [WebinarController::class, 'register']);
    Route::get('/academy/courses', [AcademyController::class, 'index']);

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

        // Phase 3: Business Modules (CRM, Storefront, Binary MLM)
        Route::get('/crm/leads', [CrmController::class, 'index']);
        Route::post('/crm/leads', [CrmController::class, 'store']);
        Route::put('/crm/leads/{lead}/stage', [CrmController::class, 'updateStage']);

        Route::put('/storefront', [StorefrontController::class, 'update']);

        Route::get('/binary/tree', [BinaryController::class, 'tree']);
        Route::post('/binary/pairing/calculate', [BinaryController::class, 'triggerPairing']);

        // Phase 4: Growth Modules (AI Lead Finder, Academy Progress, Marketing CAPI)
        Route::get('/leads/search', [LeadFinderController::class, 'search']);
        Route::post('/leads/import', [LeadFinderController::class, 'import']);

        Route::post('/academy/courses/{course}/lessons/{lessonId}/toggle', [AcademyController::class, 'toggleLesson']);
        Route::get('/academy/certificates', [AcademyController::class, 'certificates']);

        Route::get('/marketing/pixels', [MarketingController::class, 'getPixels']);
        Route::put('/marketing/pixels', [MarketingController::class, 'updatePixels']);
        Route::post('/marketing/campaigns', [MarketingController::class, 'createCampaign']);

        // Phase 5: Super Admin Control & Governance
        Route::middleware(['admin.super'])->prefix('admin')->group(function () {
            Route::get('/gateways', [GatewaySettingsController::class, 'index']);
            Route::put('/gateways/{gatewayKey}', [GatewaySettingsController::class, 'update']);

            Route::get('/withdrawals', [WithdrawalApprovalController::class, 'index']);
            Route::post('/withdrawals/{withdrawal}/approve', [WithdrawalApprovalController::class, 'approve']);

            Route::get('/metrics', [SystemMetricsController::class, 'index']);
        });
    });
});
