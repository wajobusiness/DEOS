<?php

namespace App\Services;

use App\Models\Member;
use App\Models\MemberSite;
use App\Models\Product;
use Illuminate\Support\Str;

class StorefrontService
{
    public function getStoreBySlugOrDomain(string $slugOrDomain): array
    {
        $site = MemberSite::with('member')
            ->where('subdomain', $slugOrDomain)
            ->orWhere('custom_domain', $slugOrDomain)
            ->first();

        if (!$site) {
            // Check by member code (EVO-ID-...)
            $member = Member::with('site')->where('member_code', $slugOrDomain)->first();
            if ($member && $member->site) {
                $site = $member->site;
                $site->setRelation('member', $member);
            }
        }

        if (!$site) {
            abort(404, 'Storefront not found.');
        }

        // Curate active products
        $products = Product::where('is_active', true)->get();

        return [
            'store' => [
                'id' => $site->id,
                'subdomain' => $site->subdomain,
                'custom_domain' => $site->custom_domain,
                'title' => $site->title,
                'headline' => $site->headline,
                'bio' => $site->bio,
                'theme_color' => $site->theme_color,
                'content_schema' => $site->content_schema,
            ],
            'owner' => [
                'name' => $site->member->name,
                'member_code' => $site->member->member_code,
                'country' => $site->member->country,
                'avatar_url' => $site->member->avatar_url,
            ],
            'products' => $products,
        ];
    }

    public function updateStore(Member $member, array $data): MemberSite
    {
        $site = $member->site ?? new MemberSite(['member_id' => $member->id]);

        if (!empty($data['subdomain'])) {
            $site->subdomain = Str::slug($data['subdomain']);
        }
        if (isset($data['custom_domain'])) {
            $site->custom_domain = strtolower(trim($data['custom_domain']));
        }
        if (!empty($data['title'])) {
            $site->title = $data['title'];
        }
        if (!empty($data['headline'])) {
            $site->headline = $data['headline'];
        }
        if (isset($data['bio'])) {
            $site->bio = $data['bio'];
        }
        if (!empty($data['theme_color'])) {
            $site->theme_color = $data['theme_color'];
        }
        if (isset($data['content_schema'])) {
            $site->content_schema = $data['content_schema'];
        }

        $site->save();
        return $site;
    }
}
