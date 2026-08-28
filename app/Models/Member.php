<?php

namespace App\Models;

use App\Enums\PlanTier;
use App\Enums\MemberRole;
use App\Enums\MemberStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Member extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $guarded = ['id'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'plan' => PlanTier::class,
        'role' => MemberRole::class,
        'status' => MemberStatus::class,
        'wallet_balance' => 'decimal:4',
        'usdt_balance' => 'decimal:4',
        'binary_left_volume' => 'decimal:4',
        'binary_right_volume' => 'decimal:4',
        'renewal_date' => 'datetime',
        'password' => 'hashed',
    ];

    public function sponsor(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'sponsor_id');
    }

    public function directReferrals(): HasMany
    {
        return $this->hasMany(Member::class, 'sponsor_id');
    }

    public function placementParent(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'placement_parent_id');
    }

    public function placementChildren(): HasMany
    {
        return $this->hasMany(Member::class, 'placement_parent_id');
    }

    public function ledgerTransactions(): HasMany
    {
        return $this->hasMany(LedgerTransaction::class, 'member_id');
    }

    public function site(): HasOne
    {
        return $this->hasOne(MemberSite::class, 'member_id');
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'member_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(MarketingCampaign::class, 'member_id');
    }

    public function trackingPixels(): HasOne
    {
        return $this->hasOne(TrackingPixel::class, 'member_id');
    }

    public function withdrawalRequests(): HasMany
    {
        return $this->hasMany(WithdrawalRequest::class, 'member_id');
    }
}
