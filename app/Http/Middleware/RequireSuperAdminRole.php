<?php

namespace App\Http\Middleware;

use App\Enums\MemberRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireSuperAdminRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, [MemberRole::SUPER_ADMIN, MemberRole::ADMIN, MemberRole::FINANCE])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Super Administrator privileges required.',
            ], 403);
        }

        return $next($request);
    }
}
