<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\AcademyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademyController extends Controller
{
    public function __construct(protected AcademyService $academyService) {}

    public function index(): JsonResponse
    {
        $courses = $this->academyService->getCourses();

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    public function toggleLesson(Request $request, Course $course, string $lessonId): JsonResponse
    {
        $result = $this->academyService->toggleLessonProgress($request->user(), $course, $lessonId);

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    public function certificates(Request $request): JsonResponse
    {
        $certs = $this->academyService->getUserCertificates($request->user());

        return response()->json([
            'success' => true,
            'data' => $certs,
        ]);
    }
}
