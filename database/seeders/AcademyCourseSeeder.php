<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseLesson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AcademyCourseSeeder extends Seeder
{
    public function run(): void
    {
        $course = Course::firstOrCreate(
            ['slug' => 'deos-core-blueprint'],
            [
                'title' => 'Digital Entrepreneurship Operating System (DEOS) Core Blueprint',
                'category' => 'Architecture & Strategy',
                'difficulty' => 'Beginner',
                'lessons_count' => 3,
                'instructor_name' => 'DEOS Engineering Core',
                'rating' => 4.90,
                'students_count' => 1420,
                'image_url' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
            ]
        );

        $lessons = [
            [
                'title' => 'Introduction to the DEOS Sovereign Entrepreneur Architecture',
                'duration' => '12:40',
                'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'description' => 'Understand the multi-tenant isolation, shared global marketplace, and fixed utility EVO token economy.',
                'sort_order' => 1,
            ],
            [
                'title' => 'Deploying Your Custom Tenant Storefront & Landing Page',
                'duration' => '18:15',
                'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'description' => 'Configure your custom domain mapping, hero headlines, product catalogs, and contact lead capture forms.',
                'sort_order' => 2,
            ],
            [
                'title' => 'CRM Lead Pipelines & Automated Contact Ingestion',
                'duration' => '15:20',
                'video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'description' => 'Master Kanban deal stages, lead scoring, activity transcripts, and 1-click lead import pipelines.',
                'sort_order' => 3,
            ],
        ];

        foreach ($lessons as $lesson) {
            CourseLesson::firstOrCreate(
                ['course_id' => $course->id, 'sort_order' => $lesson['sort_order']],
                $lesson
            );
        }
    }
}
