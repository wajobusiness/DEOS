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

    use App\Http\Middleware\EnsureMemberIsActive;
    use App\Http\Middleware\RequireSuperAdminRole;
    use App\Http\Middleware\ResolveTenantStorefront;
    use App\Http\Middleware\VerifyWebhookSignature;
    use Illuminate\Foundation\Application;
    use Illuminate\Foundation\Configuration\Exceptions;
    use Illuminate\Foundation\Configuration\Middleware;

    $app = Application::configure(basePath: dirname(__DIR__))
        ->withRouting(
            web: __DIR__.'/../routes/web.php',
            api: __DIR__.'/../routes/api.php',
            commands: __DIR__.'/../routes/console.php',
            health: '/up',
        )
        ->withMiddleware(function (Middleware $middleware) {
            $middleware->alias([
                'tenant.storefront' => ResolveTenantStorefront::class,
                'member.active' => EnsureMemberIsActive::class,
                'admin.super' => RequireSuperAdminRole::class,
                'webhook.signature' => VerifyWebhookSignature::class,
            ]);
        })
        ->withExceptions(function (Exceptions $exceptions) {
            //
        })->create();

    $app->setNamespace('App\\');

    return $app;
}
