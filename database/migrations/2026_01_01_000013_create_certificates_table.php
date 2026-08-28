<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('member_id')->index();
            $table->uuid('course_id')->index();
            $table->string('student_name', 255);
            $table->string('course_title', 255);
            $table->integer('score_percentage');
            $table->string('verification_code', 64)->unique();
            $table->timestamp('issued_at')->useCurrent();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
