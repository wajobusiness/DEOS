<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PaymentGatewaySetting extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'is_active' => 'boolean',
        'is_test_mode' => 'boolean',
        'ngn_exchange_rate' => 'decimal:2',
        'config_json' => 'array',
    ];
}
