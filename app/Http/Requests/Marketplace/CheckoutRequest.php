<?php

namespace App\Http\Requests\Marketplace;

use App\Enums\PaymentRail;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'uuid', 'exists:products,id'],
            'promoter_code' => ['nullable', 'string', 'exists:members,member_code'],
            'buyer_name' => ['required', 'string', 'max:255'],
            'buyer_email' => ['required', 'email', 'max:255'],
            'payment_rail' => ['required', new Enum(PaymentRail::class)],
        ];
    }
}
