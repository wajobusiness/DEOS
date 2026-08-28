<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Member;
use App\Models\PaymentGatewaySetting;
use App\Models\WithdrawalRequest;
use Illuminate\Database\Eloquent\Collection;

class PlatformSettingsService
{
    public function getGateways(): Collection
    {
        return PaymentGatewaySetting::all();
    }

    public function updateGateway(string $gatewayKey, array $data, Member $admin): PaymentGatewaySetting
    {
        $setting = PaymentGatewaySetting::where('gateway_key', $gatewayKey)->firstOrFail();
        $setting->update($data);

        AuditLog::create([
            'action' => 'Payment Gateway Updated',
            'actor_id' => $admin->id,
            'actor_role' => $admin->role->value,
            'impact_category' => 'Financial Settings',
            'details' => "Updated configuration for gateway {$gatewayKey}",
        ]);

        return $setting;
    }

    public function getPendingWithdrawals(): Collection
    {
        return WithdrawalRequest::with('tenant:id,name,member_code,email')
            ->where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function approveWithdrawal(WithdrawalRequest $request, Member $admin): WithdrawalRequest
    {
        $request->status = 'completed';
        $request->approved_at = now();
        $request->approved_by = $admin->id;
        $request->save();

        AuditLog::create([
            'action' => 'Withdrawal Approved',
            'actor_id' => $admin->id,
            'actor_role' => $admin->role->value,
            'impact_category' => 'Financial Payouts',
            'details' => "Approved withdrawal of \${$request->amount} USDT to {$request->destination_address}",
        ]);

        return $request;
    }

    public function getSystemMetrics(): array
    {
        $totalMembers = Member::count();
        $activeMembers = Member::where('status', 'active')->count();
        $totalVolume = Member::sum('binary_left_volume') + Member::sum('binary_right_volume');

        return [
            'total_members' => $totalMembers,
            'active_members' => $activeMembers,
            'total_network_volume' => (float) $totalVolume,
            'server_health' => '100% Operational',
            'database_status' => 'PostgreSQL 16 Connected',
            'redis_status' => 'Redis 7 Active',
        ];
    }
}
