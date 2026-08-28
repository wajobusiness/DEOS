<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_lessons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('course_id')->index();
            $table->string('title', 255);
            $table->string('duration', 32)->default('15:00');
            $table->string('video_url', 1024);
            $table->text('description')->nullable();
            $table->jsonb('summary_notes')->nullable();
            $table->jsonb('resources')->nullable();
            $table->integer('sort_order')->default(1);
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_lessons');
    }
};
