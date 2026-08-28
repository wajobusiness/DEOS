<?php

// Multi-byte string fallback polyfills
namespace Illuminate\Support {
    if (!function_exists('Illuminate\Support\mb_split')) {
        function mb_split(string $pattern, string $string, int $limit = -1): array|false {
            $result = @preg_split('/' . $pattern . '/u', $string, $limit);
            return $result !== false ? $result : preg_split('/' . preg_quote($pattern, '/') . '/', $string, $limit);
        }
    }
}

namespace {
    if (!function_exists('mb_split')) {
        function mb_split(string $pattern, string $string, int $limit = -1): array|false {
            $result = @preg_split('/' . $pattern . '/u', $string, $limit);
            return $result !== false ? $result : preg_split('/' . preg_quote($pattern, '/') . '/', $string, $limit);
        }
    }
}

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
if (file_exists(__DIR__.'/../vendor/autoload.php')) {
    require __DIR__.'/../vendor/autoload.php';
}

// Bootstrap Laravel and handle the request...
if (file_exists(__DIR__.'/../bootstrap/app.php')) {
    (require_once __DIR__.'/../bootstrap/app.php')
        ->handleRequest(Request::capture());
}
