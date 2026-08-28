<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('member_id')->index();
            $table->string('name', 255);
            $table->string('email', 255)->index();
            $table->string('phone', 64)->nullable();
            $table->string('company', 255)->nullable();
            $table->string('source', 128)->index();
            $table->string('status', 32)->default('New');
            $table->string('stage', 32)->default('Qualified');
            $table->integer('score')->default(50);
            $table->decimal('deal_value', 12, 2)->nullable();
            $table->jsonb('tags')->nullable();
            $table->jsonb('activity_log')->nullable();
            $table->timestamps();

            $table->foreign('member_id')->references('id')->on('members')->cascadeOnDelete();
            $table->index(['member_id', 'stage']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
