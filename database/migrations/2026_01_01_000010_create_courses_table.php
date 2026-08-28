<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug', 255)->unique();
            $table->string('title', 255);
            $table->string('category', 128);
            $table->string('difficulty', 64)->default('Intermediate');
            $table->uuid('instructor_id')->nullable()->index();
            $table->string('instructor_name', 255)->default('DEOS Academy');
            $table->integer('lessons_count')->default(6);
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->integer('students_count')->default(0);
            $table->string('image_url', 1024)->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->foreign('instructor_id')->references('id')->on('members')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
