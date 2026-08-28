<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_sites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('member_id')->unique();
            $table->string('subdomain', 128)->unique();
            $table->string('custom_domain', 255)->nullable()->unique();
            $table->string('dns_status', 32)->default('active');
            $table->string('ssl_status', 32)->default('active');
            $table->string('title', 255)->default('Official Storefront');
            $table->string('headline', 255)->nullable();
            $table->text('bio')->nullable();
            $table->string('theme_color', 32)->default('indigo');
            $table->jsonb('content_schema')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_sites');
    }
};
