<?php

namespace Database\Factories;

use App\Enums\MemberRole;
use App\Enums\MemberStatus;
use App\Enums\PlanTier;
use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MemberFactory extends Factory
{
    protected $model = Member::class;

    public function definition(): array
    {
        return [
            'member_code' => 'EVO-' . strtoupper(Str::random(8)),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'plan' => PlanTier::GROWTH->value,
            'role' => MemberRole::MEMBER->value,
            'status' => MemberStatus::ACTIVE->value,
            'wallet_balance' => 0.0000,
            'usdt_balance' => 0.0000,
            'binary_left_volume' => 0.0000,
            'binary_right_volume' => 0.0000,
        ];
    }
}
