<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BinaryVolumeEvent extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'bv_amount' => 'decimal:4',
        'left_volume_after' => 'decimal:4',
        'right_volume_after' => 'decimal:4',
        'metadata' => 'array',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'member_id');
    }

    public function sourceMember(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'source_member_id');
    }
}
