<?php

namespace App\Actions\Auth;

use App\Actions\Binary\CalculateDirectAndGenerationBonusAction;
use App\Actions\Binary\PlaceMemberInBinaryTreeAction;
use App\Enums\PlanTier;
use App\Enums\MemberRole;
use App\Enums\MemberStatus;
use App\Models\Member;
use App\Models\MemberSite;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RegisterMemberAction
{
    public function __construct(
        protected PlaceMemberInBinaryTreeAction $placementAction,
        protected CalculateDirectAndGenerationBonusAction $bonusAction
    ) {}

    public function execute(array $data): Member
    {
        return DB::transaction(function () use ($data) {
            $sponsor = null;
            if (!empty($data['sponsor_code'])) {
                $sponsor = Member::where('member_code', $data['sponsor_code'])->first();
            }

            // Generate unique member code (EVO-ID-XXXXXX)
            $memberCode = 'EVO-' . strtoupper(Str::random(8));
            $planTier = isset($data['plan'])
                ? (is_string($data['plan']) ? PlanTier::from(strtolower($data['plan'])) : $data['plan'])
                : PlanTier::GROWTH;

            $member = Member::create([
                'member_code' => $memberCode,
                'name' => $data['name'],
                'email' => strtolower(trim($data['email'])),
                'password' => Hash::make($data['password']),
                'phone' => $data['phone'] ?? null,
                'country' => $data['country'] ?? 'United States',
                'plan' => $planTier->value,
                'role' => MemberRole::MEMBER->value,
                'status' => MemberStatus::ACTIVE->value,
                'sponsor_id' => $sponsor?->id,
                'wallet_balance' => 0.0000,
                'usdt_balance' => 0.0000,
                'binary_left_volume' => 0.0000,
                'binary_right_volume' => 0.0000,
                'renewal_date' => now()->addYear(),
            ]);

            // Auto-provision initial storefront subdomain
            $subdomain = Str::slug($data['name']) . '-' . strtolower(Str::random(4));
            MemberSite::create([
                'member_id' => $member->id,
                'subdomain' => $subdomain,
                'title' => $data['name'] . "'s Official Hub",
                'headline' => 'Discover Premium Digital Assets & AI Solutions',
                'bio' => 'Certified Digital Entrepreneur on the DEOS Ecosystem.',
                'theme_color' => 'indigo',
            ]);

            // Place in Binary Tree & Distribute Referral Bonuses if sponsor exists
            if ($sponsor) {
                $preferredLeg = $data['placement_leg'] ?? 'AUTO';
                $this->placementAction->execute($member, $sponsor, $preferredLeg);
                $this->bonusAction->execute($member, $planTier);
            }

            return $member->fresh();
        });
    }
}
