<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('webinar_registrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('webinar_id')->index();
            $table->uuid('member_id')->nullable()->index();
            $table->string('ticket_number', 64)->unique();
            $table->string('attendee_name', 255);
            $table->string('attendee_email', 255)->index();
            $table->string('attendee_phone', 64)->nullable();
            $table->decimal('price_paid', 12, 2)->default(0.00);
            $table->string('status', 32)->default('confirmed');
            $table->string('qr_code_url', 1024)->nullable();
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamps();

            $table->foreign('webinar_id')->references('id')->on('webinars')->cascadeOnDelete();
            $table->foreign('member_id')->references('id')->on('members')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('webinar_registrations');
    }
};
