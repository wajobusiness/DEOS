<?php

namespace App\Http\Middleware;

use App\Enums\MemberStatus;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMemberIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->status !== MemberStatus::ACTIVE) {
            return response()->json([
                'success' => false,
                'message' => 'Your member account is ' . $user->status->value . '. Please contact support.',
            ], 403);
        }

        return $next($request);
    }
}
