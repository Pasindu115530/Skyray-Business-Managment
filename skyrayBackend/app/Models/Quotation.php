<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    protected $fillable = [
        'customer_name',
        'customer_email',
        'item_details',
        'status',
        'prices',
    ];

    protected $casts = [
        'item_details' => 'array',
        'prices' => 'array',
    ];
}
