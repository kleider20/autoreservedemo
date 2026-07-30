<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LayoutTemplate extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'version',
        'author',
        'description',
        'thumbnail',
        'config',
        'is_protected',
    ];

    protected function casts(): array
    {
        return [
            'config' => 'array',
            'is_protected' => 'boolean',
        ];
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(LayoutAssignment::class, 'template_id');
    }
}
