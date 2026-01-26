<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category',
        'name',
        'description',
        'image_url',
        'specifications',
        'price',
        'stock',
        'sku',
        'datasheet_path',
    ];
}
