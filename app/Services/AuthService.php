<?php

namespace App\Services;

use App\Actions\Auth\RegisterMemberAction;
use App\Actions\Auth\AuthenticateMemberAction;
use App\Models\Member;

class AuthService
{
    public function __construct(
        protected RegisterMemberAction $registerAction,
        protected AuthenticateMemberAction $authenticateAction
    ) {}

    public function register(array $data): array
    {
        $member = $this->registerAction->execute($data);
        $token = $member->createToken('deos_auth_token')->plainTextToken;

        return [
            'member' => $member->load('site'),
            'token' => $token,
        ];
    }

    public function login(string $email, string $password): array
    {
        $result = $this->authenticateAction->execute($email, $password);
        $result['member']->load('site');

        return $result;
    }

    public function logout(Member $member): void
    {
        $member->currentAccessToken()->delete();
    }

    public function forgotPassword(string $email): void
    {
        $member = Member::where('email', strtolower(trim($email)))->first();
        if ($member) {
            // Dispatch password reset notification/email in background
        }
    }

    public function resetPassword(string $email, string $newPassword): bool
    {
        $member = Member::where('email', strtolower(trim($email)))->first();
        if (!$member) return false;

        $member->password = \Illuminate\Support\Facades\Hash::make($newPassword);
        $member->save();

        // Revoke existing tokens for security
        $member->tokens()->delete();

        return true;
    }
}
