<?php

namespace App\Http\Requests\Crm;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadStageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stage' => ['required', 'string', 'in:Lead In,Contact Made,Demo Scheduled,Proposal Sent,Won,Lost'],
            'deal_value' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
