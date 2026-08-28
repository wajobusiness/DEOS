<?php

namespace App\Http\Requests\Wallet;

use App\Enums\PaymentRail;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class DepositRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:5.00'],
            'payment_rail' => ['required', new Enum(PaymentRail::class)],
            'receipt_image' => ['nullable', 'string'],
        ];
    }
}
