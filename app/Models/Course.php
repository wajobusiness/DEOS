<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasUuids;

    protected $guarded = ['id'];

    protected $casts = [
        'rating' => 'decimal:2',
        'lessons_count' => 'integer',
        'students_count' => 'integer',
        'is_published' => 'boolean',
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'instructor_id');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(CourseLesson::class, 'course_id')->orderBy('sort_order', 'asc');
    }
}
