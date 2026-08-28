<?php

namespace Tests\Feature;

use App\Models\Member;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_sanctum_token(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Alice Founder',
            'email' => 'alice@founder.com',
            'password' => 'SecureSecret2026!',
            'country' => 'United States',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'member' => ['id', 'member_code', 'name', 'email', 'plan', 'role'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('members', ['email' => 'alice@founder.com']);
        $this->assertDatabaseHas('member_sites', ['theme_color' => 'indigo']);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $member = Member::factory()->create([
            'email' => 'bob@growth.com',
            'password' => bcrypt('ValidPassword2026!'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'bob@growth.com',
            'password' => 'ValidPassword2026!',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'token',
                    'member',
                ],
            ]);
    }
}
