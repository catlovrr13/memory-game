<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(["user_id", "uuid", "extension"])]
#[Appends(["file_name"])]
class Image extends Model
{
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function getFileNameAttribute(){
        return "$this->uuid.$this->extension";
    }
}
