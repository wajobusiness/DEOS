<?php

namespace App\Models;

use App\Enums\WebinarType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Webinar extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'webinar_type' => WebinarType::class,
        'is_paid' => 'boolean',
        'is_evergreen' => 'boolean',
        'ticket_price' => 'decimal:2',
        'registered_count' => 'integer',
        'capacity' => 'integer',
        'speakers' => 'array',
        'dynamic_ctas' => 'array',
        'ai_host_config' => 'array',
        'affiliate_config' => 'array',
        'date' => 'date',
    ];

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'organizer_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(WebinarRegistration::class, 'webinar_id');
    }
}
