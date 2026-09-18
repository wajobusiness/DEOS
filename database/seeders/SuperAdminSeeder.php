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
        $email = env('SUPERADMIN_EMAIL', 'admin@evionaecosystem.com');
        $password = env('SUPERADMIN_PASSWORD', 'AdminSecret2026!');
        $name = env('SUPERADMIN_NAME', 'DEOS Super Administrator');
        $code = env('SUPERADMIN_CODE', 'EVO-ADMIN-001');
        $phone = env('SUPERADMIN_PHONE', '+15550198234');
        $country = env('SUPERADMIN_COUNTRY', 'United States');

        $admin = Member::updateOrCreate(
            ['email' => $email],
            [
                'member_code' => $code,
                'name' => $name,
                'password' => Hash::make($password, ['rounds' => 12]),
                'phone' => $phone,
                'country' => $country,
                'plan' => PlanTier::LEGACY->value,
                'role' => MemberRole::SUPER_ADMIN->value,
                'status' => MemberStatus::ACTIVE->value,
                'wallet_balance' => 50000.0000,
                'usdt_balance' => 50000.0000,
                'email_verified_at' => now(),
            ]
        );

        MemberSite::updateOrCreate(
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
