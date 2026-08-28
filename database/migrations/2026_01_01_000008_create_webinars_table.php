<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('webinars', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organizer_id')->index();
            $table->string('slug', 255)->unique();
            $table->string('title', 255);
            $table->string('subtitle', 255)->nullable();
            $table->text('description')->nullable();
            $table->string('category', 128);
            $table->string('webinar_type', 64)->default('free_live');
            $table->date('date');
            $table->time('time');
            $table->string('timezone', 64)->default('UTC');
            $table->integer('capacity')->default(500);
            $table->integer('registered_count')->default(0);
            $table->boolean('is_paid')->default(false);
            $table->decimal('ticket_price', 12, 2)->default(0.00);
            $table->boolean('is_evergreen')->default(false);
            $table->string('video_source', 64)->default('youtube');
            $table->string('video_embed_url', 1024)->nullable();
            $table->string('replay_url', 1024)->nullable();
            $table->string('status', 32)->default('Upcoming');
            $table->jsonb('speakers')->nullable();
            $table->jsonb('dynamic_ctas')->nullable();
            $table->jsonb('ai_host_config')->nullable();
            $table->jsonb('affiliate_config')->nullable();
            $table->timestamps();

            $table->foreign('organizer_id')->references('id')->on('members')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('webinars');
    }
};
