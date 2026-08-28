<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (Auth::check()) {
            $user = Auth::user();
            // Super admins can bypass tenant scope when explicitly requested
            if (!($user->role?->isAdministrative() && request()->header('X-Bypass-Tenant') === 'true')) {
                $builder->where($model->getTable() . '.member_id', $user->id);
            }
        }
    }
}
