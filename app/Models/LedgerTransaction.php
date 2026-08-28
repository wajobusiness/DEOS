<?php

namespace App\Models;

use App\Enums\LedgerEventType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LedgerTransaction extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'type' => LedgerEventType::class,
        'amount' => 'decimal:4',
        'metadata' => 'array',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
