<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\PaymentRail;
use App\Http\Controllers\Controller;
use App\Http\Requests\Wallet\DepositRequest;
use App\Http\Requests\Wallet\TransferRequest;
use App\Http\Requests\Wallet\WithdrawRequest;
use App\Services\PaymentGatewayService;
use App\Services\WalletLedgerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function __construct(
        protected WalletLedgerService $walletService,
        protected PaymentGatewayService $gatewayService
    ) {}

    public function balance(Request $request): JsonResponse
    {
        $data = $this->walletService->getBalance($request->user());

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function transactions(Request $request): JsonResponse
    {
        $transactions = $this->walletService->getTransactions($request->user());

        return response()->json([
            'success' => true,
            'data' => $transactions->items(),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'total' => $transactions->total(),
                'last_page' => $transactions->lastPage(),
            ],
        ]);
    }

    public function initializeDeposit(DepositRequest $request): JsonResponse
    {
        $rail = PaymentRail::from($request->payment_rail);
        $result = $this->gatewayService->initializeDeposit(
            $request->user(),
            (float) $request->amount,
            $rail
        );

        return response()->json([
            'success' => true,
            'message' => 'Deposit session initialized.',
            'data' => $result,
        ]);
    }

    public function transfer(TransferRequest $request): JsonResponse
    {
        $result = $this->walletService->transfer(
            $request->user(),
            $request->recipient_identifier,
            (float) $request->amount,
            $request->note
        );

        return response()->json([
            'success' => true,
            'message' => 'Funds transferred successfully.',
            'data' => $result,
        ]);
    }

    public function withdraw(WithdrawRequest $request): JsonResponse
    {
        $withdrawal = $this->walletService->requestWithdrawal($request->user(), $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Withdrawal request submitted to administrative queue.',
            'data' => $withdrawal,
        ], 201);
    }
}
