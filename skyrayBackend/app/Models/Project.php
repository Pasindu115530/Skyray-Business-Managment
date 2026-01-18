<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'client_name',
        'status',
        'start_date',
        'budget',
        'category',
        'image_url'
    ];
}
