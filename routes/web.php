<?php

use Illuminate\Support\Facades\Route;

// Health check probe
Route::get('/healthz', function () {
    return response()->json([
        'status' => 'healthy',
        'platform' => 'DEOS SaaS Core',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Single Page Application (React Frontend Catch-All)
Route::get('/{any?}', function () {
    if (view()->exists('app')) {
        return view('app');
    }
    return view('welcome');
})->where('any', '^(?!api).*$');
