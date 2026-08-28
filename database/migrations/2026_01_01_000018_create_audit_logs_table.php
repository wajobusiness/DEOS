<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('action', 128);
            $table->uuid('actor_id')->index();
            $table->string('actor_role', 64);
            $table->string('impact_category', 64)->index();
            $table->text('details');
            $table->jsonb('metadata')->nullable();
            $table->timestamps();

            $table->index(['impact_category', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
