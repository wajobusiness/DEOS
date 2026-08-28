<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Member;
use App\Models\UserLessonProgress;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class AcademyService
{
    public function getCourses(): Collection
    {
        return Course::with(['instructor:id,name,member_code,avatar_url', 'lessons'])
            ->where('is_published', true)
            ->get();
    }

    public function toggleLessonProgress(Member $member, Course $course, string $lessonId): array
    {
        $existing = UserLessonProgress::where('member_id', $member->id)
            ->where('lesson_id', $lessonId)
            ->first();

        if ($existing) {
            $existing->delete();
            $isCompleted = false;
        } else {
            UserLessonProgress::create([
                'member_id' => $member->id,
                'course_id' => $course->id,
                'lesson_id' => $lessonId,
                'is_completed' => true,
            ]);
            $isCompleted = true;
        }

        $completedCount = UserLessonProgress::where('member_id', $member->id)
            ->where('course_id', $course->id)
            ->count();

        $totalLessons = $course->lessons()->count();

        return [
            'lesson_id' => $lessonId,
            'is_completed' => $isCompleted,
            'completed_count' => $completedCount,
            'total_lessons' => $totalLessons,
            'progress_percent' => $totalLessons > 0 ? round(($completedCount / $totalLessons) * 100) : 0,
        ];
    }

    public function issueCertificate(Member $member, Course $course, int $scorePercentage): Certificate
    {
        $verificationCode = 'DEOS-VERIFY-' . strtoupper(Str::random(7));

        return Certificate::create([
            'member_id' => $member->id,
            'course_id' => $course->id,
            'student_name' => $member->name,
            'course_title' => $course->title,
            'score_percentage' => $scorePercentage,
            'verification_code' => $verificationCode,
        ]);
    }

    public function getUserCertificates(Member $member): Collection
    {
        return Certificate::with('course')->where('member_id', $member->id)->orderBy('issued_at', 'desc')->get();
    }
}
