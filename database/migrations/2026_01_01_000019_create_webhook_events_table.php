<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('webhook_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('gateway', 64)->index();
            $table->string('event_id', 128)->index();
            $table->string('event_type', 64)->nullable()->index();
            $table->string('reference', 128)->nullable()->index();
            $table->string('status', 32)->default('processed');
            $table->json('payload')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->unique(['gateway', 'event_id'], 'uq_gateway_event');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('webhook_events');
    }
};
