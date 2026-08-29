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

// Explicit Homepage Route
Route::get('/', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }
    if (view()->exists('app')) {
        return view('app');
    }
    return view('welcome');
});

// Single Page Application (React Frontend Fallback for Client-Side Routing)
Route::fallback(function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }
    if (view()->exists('app')) {
        return view('app');
    }
    return view('welcome');
});
