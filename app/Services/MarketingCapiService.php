<?php

namespace App\Services;

use App\Models\MarketingCampaign;
use App\Models\Member;
use App\Models\TrackingPixel;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MarketingCapiService
{
    public function getPixels(Member $member): ?TrackingPixel
    {
        return TrackingPixel::where('member_id', $member->id)->first();
    }

    public function updatePixels(Member $member, array $data): TrackingPixel
    {
        return TrackingPixel::updateOrCreate(
            ['member_id' => $member->id],
            $data
        );
    }

    public function createCampaign(Member $member, array $data): MarketingCampaign
    {
        $sep = str_contains($data['target_url'], '?') ? '&' : '?';
        $fullUrl = "{$data['target_url']}{$sep}utm_source=" . urlencode($data['utm_source']) . "&utm_medium=" . urlencode($data['utm_medium']) . "&utm_campaign=" . urlencode($data['utm_campaign']);

        return MarketingCampaign::create([
            'member_id' => $member->id,
            'name' => $data['name'],
            'channel' => $data['channel'],
            'target_url' => $data['target_url'],
            'utm_source' => $data['utm_source'],
            'utm_medium' => $data['utm_medium'],
            'utm_campaign' => $data['utm_campaign'],
            'full_campaign_url' => $fullUrl,
        ]);
    }

    public function dispatchCapiEvent(Member $member, string $eventName, array $customData = []): void
    {
        $pixels = $this->getPixels($member);
        if (!$pixels || !$pixels->meta_pixel_id || !$pixels->meta_capi_token) {
            return;
        }

        try {
            // Dispatch to Meta Conversions API (Graph API)
            Http::timeout(5)->post("https://graph.facebook.com/v19.0/{$pixels->meta_pixel_id}/events", [
                'access_token' => $pixels->meta_capi_token,
                'data' => [
                    [
                        'event_name' => $eventName,
                        'event_time' => time(),
                        'action_source' => 'website',
                        'user_data' => [
                            'client_ip_address' => request()->ip(),
                            'client_user_agent' => request()->userAgent(),
                        ],
                        'custom_data' => $customData,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            // Log telemetry error non-blockingly
        }
    }
}
