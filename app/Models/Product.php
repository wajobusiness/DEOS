<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'price' => 'decimal:2',
        'affiliate_commission_rate' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_active' => 'boolean',
        'sales_count' => 'integer',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'seller_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(MarketplaceOrderItem::class, 'product_id');
    }
}
