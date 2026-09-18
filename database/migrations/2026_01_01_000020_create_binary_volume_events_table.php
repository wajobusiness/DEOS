<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('binary_volume_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('member_id')->index();
            $table->uuid('source_member_id')->index();
            $table->decimal('bv_amount', 16, 4);
            $table->string('leg', 16); // 'L' or 'R'
            $table->string('source_type', 64)->default('membership_activation');
            $table->string('source_reference', 128)->nullable()->index();
            $table->decimal('left_volume_after', 16, 4)->default(0.0000);
            $table->decimal('right_volume_after', 16, 4)->default(0.0000);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
            $table->foreign('source_member_id')->references('id')->on('members')->cascadeOnDelete();
            $table->index(['member_id', 'created_at']);
            $table->index(['source_member_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('binary_volume_events');
    }
};

