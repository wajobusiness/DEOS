<?php

namespace App\Traits;

use App\Models\Member;
use App\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait BelongsToTenant
{
    /**
     * Boot the trait and attach the global tenant scope.
     */
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope());

        static::creating(function ($model) {
            if (!$model->member_id && Auth::check()) {
                $model->member_id = Auth::id();
            }
        });
    }

    /**
     * Get the tenant member that owns this model.
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'member_id');
    }
}
