<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(["first_name", "user_id", "last_name", "phone_number"])]
class Profile extends Model
{
    public function user(){
        return $this->belongsTo(User::class);
    }
}
