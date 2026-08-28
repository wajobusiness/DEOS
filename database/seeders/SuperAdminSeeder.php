<?php

namespace Database\Seeders;

use App\Enums\PlanTier;
use App\Enums\MemberRole;
use App\Enums\MemberStatus;
use App\Models\Member;
use App\Models\MemberSite;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Member::firstOrCreate(
            ['email' => 'admin@evionaecosystem.com'],
            [
                'member_code' => 'EVO-ADMIN-001',
                'name' => 'DEOS Super Administrator',
                'password' => Hash::make('AdminSecret2026!'),
                'phone' => '+15550198234',
                'country' => 'United States',
                'plan' => PlanTier::LEGACY->value,
                'role' => MemberRole::SUPER_ADMIN->value,
                'status' => MemberStatus::ACTIVE->value,
                'wallet_balance' => 50000.0000,
                'usdt_balance' => 50000.0000,
            ]
        );

        MemberSite::firstOrCreate(
            ['member_id' => $admin->id],
            [
                'subdomain' => 'admin-hub',
                'title' => 'DEOS Platform Master Center',
                'headline' => 'Official Enterprise SaaS Backbone',
                'bio' => 'Master System Governance & Settlement Operations.',
                'theme_color' => 'slate',
            ]
        );
    }
}
