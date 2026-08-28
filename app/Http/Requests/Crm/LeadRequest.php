<?php

namespace App\Http\Requests\Crm;

use Illuminate\Foundation\Http\FormRequest;

class LeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'company' => ['nullable', 'string', 'max:255'],
            'source' => ['required', 'string', 'max:128'],
            'stage' => ['nullable', 'string', 'max:32'],
            'deal_value' => ['nullable', 'numeric', 'min:0'],
            'tags' => ['nullable', 'array'],
        ];
    }
}
