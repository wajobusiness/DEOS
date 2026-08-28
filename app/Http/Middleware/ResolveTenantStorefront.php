<?php

namespace App\Http\Middleware;

use App\Models\MemberSite;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenantStorefront
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $baseDomain = config('app.base_domain', 'evionaecosystem.com');

        // Check if custom domain or subdomain
        if (str_ends_with($host, '.' . $baseDomain)) {
            $subdomain = str_replace('.' . $baseDomain, '', $host);
            if ($subdomain !== 'www' && $subdomain !== 'api' && $subdomain !== 'app') {
                $site = MemberSite::with('member')->where('subdomain', $subdomain)->first();
                if ($site) {
                    $request->attributes->set('tenant_site', $site);
                    $request->attributes->set('tenant_member', $site->member);
                }
            }
        } else {
            // Check for apex custom domain (e.g. store.alexmercer.com)
            $site = MemberSite::with('member')->where('custom_domain', $host)->first();
            if ($site) {
                $request->attributes->set('tenant_site', $site);
                $request->attributes->set('tenant_member', $site->member);
            }
        }

        return $next($request);
    }
}
