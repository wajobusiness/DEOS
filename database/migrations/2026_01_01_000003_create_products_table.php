<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug', 255)->unique();
            $table->string('title', 255);
            $table->string('category', 128)->index();
            $table->text('description');
            $table->decimal('price', 12, 2);
            $table->decimal('affiliate_commission_rate', 5, 2)->default(0.40);
            $table->uuid('seller_id')->index();
            $table->string('image_url', 1024);
            $table->string('digital_file_url', 1024)->nullable();
            $table->string('license_type', 64)->default('standard');
            $table->integer('sales_count')->default(0);
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('seller_id')->references('id')->on('members')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
