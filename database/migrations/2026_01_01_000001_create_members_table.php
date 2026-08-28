<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('member_code', 32)->unique();
            $table->string('name', 255);
            $table->string('email', 255)->unique();
            $table->string('password', 255);
            $table->string('phone', 64)->nullable();
            $table->string('country', 64)->nullable();
            $table->string('avatar_url', 1024)->nullable();
            $table->string('plan', 32)->default('growth');
            $table->string('role', 32)->default('member');
            $table->string('status', 32)->default('active');
            $table->string('rank', 64)->default('Member');
            $table->uuid('sponsor_id')->nullable()->index();
            $table->uuid('placement_parent_id')->nullable()->index();
            $table->string('placement_leg', 16)->nullable(); // 'L' or 'R'
            $table->decimal('wallet_balance', 16, 4)->default(0.0000);
            $table->decimal('usdt_balance', 16, 4)->default(0.0000);
            $table->decimal('binary_left_volume', 16, 4)->default(0.0000);
            $table->decimal('binary_right_volume', 16, 4)->default(0.0000);
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('renewal_date')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('sponsor_id')->references('id')->on('members')->nullOnDelete();
            $table->foreign('placement_parent_id')->references('id')->on('members')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
