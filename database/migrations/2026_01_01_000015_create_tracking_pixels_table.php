<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tracking_pixels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('member_id')->unique();
            $table->string('meta_pixel_id', 128)->nullable();
            $table->string('meta_capi_token', 512)->nullable();
            $table->string('ga4_measurement_id', 128)->nullable();
            $table->string('gtm_container_id', 128)->nullable();
            $table->string('tiktok_pixel_id', 128)->nullable();
            $table->string('tiktok_api_token', 512)->nullable();
            $table->string('linkedin_tag_id', 128)->nullable();
            $table->string('snapchat_pixel_id', 128)->nullable();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tracking_pixels');
    }
};
