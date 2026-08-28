<?php

use Illuminate\Support\Facades\Route;

Route::get('/healthz', function () {
    return response()->json([
        'status' => 'healthy',
        'platform' => 'DEOS SaaS Core',
        'timestamp' => now()->toIso8601String(),
    ]);
});
