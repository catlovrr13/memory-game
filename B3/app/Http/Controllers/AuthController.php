<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;

class AuthController extends Controller
{
    public function register()
    {
        $error_msgs = [];
        $inputs = request()->all();

        $this->ValidateName($inputs["first_name"], $error_msgs["first_name"], "First Name");
        $this->ValidateName($inputs["last_name"], $error_msgs["last_name"], "Last Name");
        $this->ValidateEmail($inputs["email"] ?? "", $error_msgs["email"]);
        $this->ValidatePhoneNumber($inputs["phone_number"] ?? "", $error_msgs["phone_number"]);
        $this->ValidatePassword($inputs["password"], $inputs["password_confirmation"], $error_msgs["password"]);

        $error_msgs = array_filter($error_msgs, function ($value) {
            return $value;
        });

        if (count($error_msgs) > 0) {
            return $this->BadRequest($error_msgs);
        }

        $user = User::create([
            "email" => $inputs["email"],
            "password" => $inputs["password"],
            "role" => User::first() ? "user" : "admin"
        ]);

        $user->profile()->create([
            "first_name" => $inputs["first_name"],
            "last_name" => $inputs["last_name"],
            "phone_number" => $inputs["phone_number"],
        ]);

        $user->token = $user->createToken("token")->plainTextToken;

        return $this->Created($user, "User registered successfully");
    }

    public function login()
    {
        $loginAttempts = "login_attempt_" . request()->ip();

        if (cache()->has($loginAttempts)) {
            $data = cache()->get($loginAttempts);
            $seconds = $data["expires_at"];

            if ($data["attempt"] > 5){
                return response()->json([
                    "ok" => false,
                    "message" => "Too many login attempts.",
                    "expires_at" => $seconds,
                    "attempts"=> $data["attempt"]
                ], 429);
            }
        }


        $validator = validator(request()->all(), [
            "email" => "required",
            "password" => "required",
        ]);

        if ($validator->fails()) {
            return $this->BadRequest($validator->errors());
        }

        if (!auth()->guard("web")->attempt($validator->validated())) {
            if (cache()->has($loginAttempts)) {
            $data = cache()->get($loginAttempts);

                cache()->put($loginAttempts, [
                    "attempt" => $data["attempt"] + 1,
                    "expires_at" => now()->addMinutes(5)
                ], now()->addMinutes(5));
            } else {
                cache()->put($loginAttempts, [
                    "attempt" => 1,
                    "expires_at" => now()->addMinutes(5)
                ], now()->addMinutes(5));
            }
            return $this->Unauthenticated("Invalid credentials.");
        }

        $user = auth()->user();
        $user->token = $user->createToken("token")->plainTextToken;

        return $this->OK($user, "User logged in successfully");
    }

    #[Middleware("auth:sanctum")]
    public function logout(){
        request()->user()->tokens()->delete();

        return $this->OK([], "User logged out successfully.");
    }
}
