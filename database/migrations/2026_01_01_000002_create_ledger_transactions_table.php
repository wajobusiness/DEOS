<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ledger_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('member_id')->index();
            $table->string('type', 64)->index();
            $table->decimal('amount', 16, 4);
            $table->string('currency', 16)->default('EVO');
            $table->string('description', 512);
            $table->string('status', 32)->default('Completed');
            $table->string('reference_id', 128)->nullable()->unique();
            $table->jsonb('metadata')->nullable();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
            $table->index(['member_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_transactions');
    }
};
