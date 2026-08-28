<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_gateway_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('gateway_key', 64)->unique(); // 'paystack', 'cryptomus', 'stripe', 'bank_transfer'
            $table->string('name', 128);
            $table->boolean('is_active')->default(false);
            $table->boolean('is_test_mode')->default(true);
            $table->string('public_key', 255)->nullable();
            $table->text('secret_key')->nullable();
            $table->string('merchant_id', 255)->nullable();
            $table->decimal('ngn_exchange_rate', 10, 2)->default(1550.00);
            $table->jsonb('config_json')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_gateway_settings');
    }
};
