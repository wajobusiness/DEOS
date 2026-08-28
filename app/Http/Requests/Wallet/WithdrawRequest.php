<?php

namespace App\Http\Requests\Wallet;

use Illuminate\Foundation\Http\FormRequest;

class WithdrawRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:20.00'],
            'destination_type' => ['required', 'in:crypto,bank'],
            'destination_address' => ['required', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:128'],
            'account_name' => ['nullable', 'string', 'max:128'],
        ];
    }
}
