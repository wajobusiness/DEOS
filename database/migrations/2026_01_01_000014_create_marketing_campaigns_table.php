<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketing_campaigns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('member_id')->index();
            $table->string('name', 255);
            $table->string('channel', 64);
            $table->string('target_url', 1024);
            $table->string('utm_source', 128);
            $table->string('utm_medium', 128);
            $table->string('utm_campaign', 128);
            $table->string('full_campaign_url', 1024);
            $table->integer('clicks')->default(0);
            $table->integer('leads_generated')->default(0);
            $table->integer('sales_generated')->default(0);
            $table->decimal('revenue', 12, 2)->default(0.00);
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketing_campaigns');
    }
};
