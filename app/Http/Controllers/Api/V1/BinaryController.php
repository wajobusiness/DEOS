<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\BinaryEngineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BinaryController extends Controller
{
    public function __construct(protected BinaryEngineService $binaryService) {}

    public function tree(Request $request): JsonResponse
    {
        $depth = min((int) $request->query('depth', 3), 5);
        $tree = $this->binaryService->getTree($request->user(), $depth);

        return response()->json([
            'success' => true,
            'data' => $tree,
        ]);
    }

    public function triggerPairing(Request $request): JsonResponse
    {
        $result = $this->binaryService->calculatePairing($request->user());

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'No matched binary volume available for commission calculation.',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => '10% Binary matching bonus calculated and credited to wallet.',
            'data' => $result,
        ]);
    }
}
