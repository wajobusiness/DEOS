<?php

namespace App\Http\Requests\Auth;

use App\Enums\PlanTier;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:members,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:64'],
            'country' => ['nullable', 'string', 'max:64'],
            'plan' => ['nullable', new Enum(PlanTier::class)],
            'sponsor_code' => ['nullable', 'string', 'exists:members,member_code'],
            'placement_leg' => ['nullable', 'in:L,R'],
        ];
    }
}
