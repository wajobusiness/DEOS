<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('withdrawal_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('member_id')->index();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 16)->default('USDT');
            $table->string('destination_type', 32); // 'crypto', 'bank'
            $table->string('destination_address', 255);
            $table->string('bank_name', 128)->nullable();
            $table->string('account_name', 128)->nullable();
            $table->string('status', 32)->default('pending'); // 'pending', 'approved', 'rejected', 'completed'
            $table->string('rejection_reason', 512)->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('withdrawal_requests');
    }
};
