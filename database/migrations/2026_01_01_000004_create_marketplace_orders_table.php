<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marketplace_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_number', 64)->unique();
            $table->uuid('buyer_member_id')->nullable()->index();
            $table->string('buyer_name', 255);
            $table->string('buyer_email', 255)->index();
            $table->uuid('promoter_member_id')->nullable()->index();
            $table->decimal('total_amount', 12, 2);
            $table->decimal('platform_fee', 12, 2);
            $table->decimal('promoter_commission', 12, 2)->default(0.00);
            $table->decimal('upline_override', 12, 2)->default(0.00);
            $table->decimal('seller_payout', 12, 2);
            $table->string('payment_method', 64);
            $table->string('payment_rail', 64);
            $table->string('status', 32)->default('paid');
            $table->string('license_key', 128)->nullable();
            $table->timestamps();

            $table->foreign('buyer_member_id')->references('id')->on('members')->nullOnDelete();
            $table->foreign('promoter_member_id')->references('id')->on('members')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marketplace_orders');
    }
};
