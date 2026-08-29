<?php

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

    use Illuminate\Http\Request;

    define('LARAVEL_START', microtime(true));

    $appRoot = file_exists(__DIR__.'/vendor/autoload.php')
        ? __DIR__
        : (file_exists(__DIR__.'/../vendor/autoload.php')
            ? __DIR__.'/..'
            : (file_exists(__DIR__.'/../deos/vendor/autoload.php')
                ? __DIR__.'/../deos'
                : '/home/eviona/deos'));

    // Determine if the application is in maintenance mode...
    if (file_exists($maintenance = $appRoot.'/storage/framework/maintenance.php')) {
        require $maintenance;
    }

    // Register the Composer autoloader...
    if (file_exists($appRoot.'/vendor/autoload.php')) {
        require $appRoot.'/vendor/autoload.php';
    }

    // Bootstrap Laravel and handle the request...
    if (file_exists($appRoot.'/bootstrap/app.php')) {
        (require_once $appRoot.'/bootstrap/app.php')
            ->handleRequest(Request::capture());
    }
}
