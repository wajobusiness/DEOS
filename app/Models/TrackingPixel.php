<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class TrackingPixel extends Model
{
    use HasUuids, BelongsToTenant;

    protected $guarded = ['id'];
}
