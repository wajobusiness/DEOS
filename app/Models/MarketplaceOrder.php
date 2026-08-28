<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentRail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MarketplaceOrder extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'status' => OrderStatus::class,
        'payment_rail' => PaymentRail::class,
        'total_amount' => 'decimal:2',
        'platform_fee' => 'decimal:2',
        'promoter_commission' => 'decimal:2',
        'upline_override' => 'decimal:2',
        'seller_payout' => 'decimal:2',
    ];

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'buyer_member_id');
    }

    public function promoter(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'promoter_member_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(MarketplaceOrderItem::class, 'order_id');
    }
}
