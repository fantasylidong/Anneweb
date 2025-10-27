<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table): void {
            $table->id();
            $table->string('name')->nullable();
            $table->string('contact', 128)->nullable();
            $table->unsignedInteger('amount')->comment('金额，单位：分');
            $table->string('payment_method', 64)->default('wechat');
            $table->string('external_reference', 128)->nullable();
            $table->text('note')->nullable();
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
