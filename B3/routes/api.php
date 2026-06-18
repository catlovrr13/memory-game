<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"]);
Route::post("/logout", [AuthController::class, "logout"]);
Route::put("/users/theme", [UserController::class, "updateTheme"]);

Route::middleware("auth:sanctum")->group(function () {
    Route::get("/users", [UserController::class, "index"]);
    Route::get("/users/{id}", [UserController::class, "show"]);
    Route::put("/users/{id}", [UserController::class, "update"]);
    Route::put("/users/{id}/role", [UserController::class, "updateRole"]);
    Route::delete("/users/{id}", [UserController::class, "destroy"]);
});

Route::middleware("auth:sanctum")->group(function () {
    Route::post("/uploads", [ImageController::class, "upload"]);
    Route::get("/uploads", [ImageController::class, "index"]);
    Route::get("/uploads/{uuid}", [ImageController::class, "show"]);
});

Route::middleware("auth:sanctum")->group(function () {
    Route::get("/scores", [ScoreController::class, "index"]);
    Route::post("/scores", [ScoreController::class, "store"]);
    Route::get("/scores/ranks", [ScoreController::class, "ranks"]);
});