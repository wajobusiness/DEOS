<?php

use App\Http\Controllers\SpaController;
use Illuminate\Support\Facades\Route;

// Health check probe
Route::get('/healthz', function () {
    return response()->json([
        'status' => 'healthy',
        'platform' => 'DEOS SaaS Core',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Single Page Application Routes (Home, Backoffice, Dashboard, and Fallback)
Route::get('/', [SpaController::class, 'index']);
Route::get('/backoffice/{any?}', [SpaController::class, 'index'])->where('any', '.*');
Route::fallback([SpaController::class, 'index']);
