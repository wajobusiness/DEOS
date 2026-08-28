<?php

namespace App\Actions\Auth;

use App\Models\Member;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticateMemberAction
{
    public function execute(string $email, string $password): array
    {
        $member = Member::where('email', strtolower(trim($email)))->first();

        if (!$member || !Hash::check($password, $member->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $token = $member->createToken('deos_auth_token')->plainTextToken;

        return [
            'member' => $member,
            'token' => $token,
        ];
    }
}
