<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        Gate::authorize("viewAny", User::class);

        $users = User::all();

        Log::info(auth()->user()->profile->first_name . " accessed all users.");

        return $this->OK($users);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (empty($user)) {
            return $this->NotFound();
        }

        Gate::authorize("view", $user);

        Log::info(auth()->user()->profile->first_name . " accessed user $id.");

        return $this->OK($user);
    }

    public function update($id)
    {
        $user = User::find($id);

        if (empty($user)) {
            return $this->NotFound();
        }

        Gate::authorize("update", $user);

        $validator = validator(request()->all(), [
            "email" => "sometimes",
            "first_name" => "sometimes",
            "last_name" => "sometimes",
            "phone_number" => "sometimes",
            "password" => "sometimes",
        ]);

        if ($validator->fails()) {
            return $this->BadRequest($validator->errors());
        }

        $validated = $validator->validated();

        $user->update([
            "email" => $validated["email"] ?? $user->email,
            "password" => $validated["password"] ?? $user->password,
        ]);

        $user->profile->update([
            "first_name" => $validated["first_name"] ?? $user->profile->first_name,
            "last_name" => $validated["last_name"] ?? $user->profile->last_name,
            "phone_number" => $validated["phone_number"] ?? $user->profile->phone_number,
        ]);

        Log::info(auth()->user()->profile->first_name . " updated user $id.");
        return $this->OK($user, "User updated successfully");
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (empty($user)) {
            return $this->NotFound();
        }

        Gate::authorize("delete", $user);

        $user->delete();

        Log::info(auth()->user()->profile->first_name . " deleted user $id.");

        return $this->OK($user, "User deleted successfully");
    }

    public function updateRole($id)
    {
        $user = User::find($id);

        if (empty($user)) {
            return $this->NotFound();
        }

        Gate::authorize("updateRole", $user);

        $validator = validator(request()->all(), [
            "role" => ["required", Rule::in(["admin", "user"])]
        ]);

        if ($validator->fails()) {
            return $this->BadRequest($validator->errors());
        }

        $validated = $validator->validated();

        $user->update([
            "role" => $validated["role"]
        ]);

        Log::info(auth()->user()->profile->first_name . " updated the role of user $id.");

        return $this->OK($user, "User role updated successfully");
    }

    #[Middleware("auth:sanctum")]
    public function updateTheme()
    {
        if (!auth()->user()){
            return $this->Forbidden();
        }
        $user = auth()->user();
        $validator = validator(request()->all(), [
            "theme" => ["required", Rule::in(["dark", "light"])]
        ]);

        if ($validator->fails()) {
            return $this->BadRequest($validator->errors());
        }

        $validated = $validator->validated();

        $user->update([
            "theme" => $validated["theme"]
        ]);

        return $this->OK($user, "User theme updated successfully");
    }
}
