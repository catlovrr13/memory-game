<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(["score", "user_id", "level_reached"])]
class Score extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
