<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipient_identifier' => ['required', 'string'], // member_code or email
            'amount' => ['required', 'numeric', 'min:1.00'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
