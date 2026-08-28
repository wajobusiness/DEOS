<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\WithdrawalRequest;
use App\Services\PlatformSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WithdrawalApprovalController extends Controller
{
    public function __construct(protected PlatformSettingsService $settingsService) {}

    public function index(): JsonResponse
    {
        $withdrawals = $this->settingsService->getPendingWithdrawals();

        return response()->json([
            'success' => true,
            'data' => $withdrawals,
        ]);
    }

    public function approve(Request $request, WithdrawalRequest $withdrawal): JsonResponse
    {
        $approved = $this->settingsService->approveWithdrawal($withdrawal, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Withdrawal approved and clearance registered on blockchain ledger.',
            'data' => $approved,
        ]);
    }
}
