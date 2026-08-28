<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasUuids, BelongsToTenant;

    protected $guarded = ['id'];

    protected $casts = [
        'deal_value' => 'decimal:2',
        'score' => 'integer',
        'tags' => 'array',
        'activity_log' => 'array',
    ];
}
