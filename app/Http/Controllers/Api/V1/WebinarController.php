<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Webinar;
use App\Services\WebinarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebinarController extends Controller
{
    public function __construct(protected WebinarService $webinarService) {}

    public function index(Request $request): JsonResponse
    {
        $webinars = $this->webinarService->getWebinars($request->query('category'));

        return response()->json([
            'success' => true,
            'data' => $webinars,
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $webinar = $this->webinarService->getWebinarBySlug($slug);

        return response()->json([
            'success' => true,
            'data' => $webinar,
        ]);
    }

    public function register(Request $request, Webinar $webinar): JsonResponse
    {
        $request->validate([
            'attendee_name' => ['required', 'string', 'max:255'],
            'attendee_email' => ['required', 'email', 'max:255'],
            'attendee_phone' => ['nullable', 'string', 'max:64'],
        ]);

        $registration = $this->webinarService->registerAttendee(
            $webinar,
            $request->all(),
            $request->user()
        );

        return response()->json([
            'success' => true,
            'message' => 'Webinar registration confirmed. Ticket pass generated.',
            'data' => $registration,
        ], 201);
    }
}
