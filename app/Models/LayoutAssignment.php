<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LayoutAssignment extends Model
{
    protected $fillable = [
        'template_id',
        'page_type',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(LayoutTemplate::class, 'template_id');
    }
}
