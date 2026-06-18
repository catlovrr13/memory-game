<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    public function upload()
    {
        $validator = validator(request()->all(), [
            "image" => "required|image|mimes:jpeg,jpg,png,svg,webp"
        ]);

        if ($validator->fails()) {
            return $this->BadRequest($validator->errors());
        }

        $uuid = Str::uuid();
        $file = request()->file("image");
        $extension = $file->getClientOriginalExtension();
        $user_id = auth()->user()->id;
        $file->storeAs("$user_id", "$uuid.$extension");

        $image = Image::create([
            "uuid" => $uuid,
            "user_id" => $user_id,
            "extension" => $extension
        ]);

        return $this->Created($image);
    }

    public function index(){
        if (!auth()->user()){
            return $this->Forbidden();
        }

        $images = auth()->user()->images;

        return $this->OK($images);
    }

    public function show($uuid){
        $image = Image::where("uuid", "=", $uuid)->first();

        if (auth()->user()->id !== $image->user_id){
            return $this->Forbidden();
        }

        if (!Storage::exists("$image->user_id/$image->file_name")){
            return $this->NotFound();
        }

        return Storage::download("$image->user_id/$image->file_name", "$image->file_name");
    }
}
