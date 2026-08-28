<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class MarketingCampaign extends Model
{
    use HasUuids, BelongsToTenant;

    protected $guarded = ['id'];

    protected $casts = [
        'clicks' => 'integer',
        'leads_generated' => 'integer',
        'sales_generated' => 'integer',
        'revenue' => 'decimal:2',
    ];
}
