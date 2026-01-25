<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->unsignedBigInteger('customer_id')->nullable(); 
            // If linked to a registered user, we might want user_id too, 
            // but for now let's assume customer_id points to the customers table
            // or we use a JSON column for guest details if needed. 
            // Following the plan: we have a customers table.
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');

            $table->decimal('total_amount', 10, 2);
            $table->string('status')->default('pending'); // pending, processing, shipped, completed, cancelled
            $table->string('payment_status')->default('pending'); // pending, paid, failed
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
