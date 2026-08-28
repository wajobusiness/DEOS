<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_lesson_progress', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('member_id')->index();
            $table->uuid('course_id')->index();
            $table->uuid('lesson_id')->index();
            $table->boolean('is_completed')->default(true);
            $table->timestamp('completed_at')->useCurrent();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
            $table->foreign('lesson_id')->references('id')->on('course_lessons')->cascadeOnDelete();
            $table->unique(['member_id', 'lesson_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_lesson_progress');
    }
};
