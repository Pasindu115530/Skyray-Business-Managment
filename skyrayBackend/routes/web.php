<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/fix-db', function () {
    try {
        \Illuminate\Support\Facades\Schema::table('products', function (\Illuminate\Database\Schema\Blueprint $table) {
            if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'price')) {
                $table->decimal('price', 10, 2)->default(0);
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'stock')) {
                $table->integer('stock')->default(0);
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'sku')) {
                $table->string('sku')->nullable();
            }
            if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'datasheet_path')) {
                $table->string('datasheet_path')->nullable();
            }
        });
        return 'Database updated successfully! Columns added.';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});
