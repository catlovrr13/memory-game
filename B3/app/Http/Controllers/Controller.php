<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;

abstract class Controller
{
    protected function OK($data, $message = "OK")
    {
        return response()->json([
            "ok" => true,
            "data" => $data,
            "message" => $message
        ], 200);
    }

    protected function Created($data, $message = "Created")
    {
        return response()->json([
            "ok" => true,
            "data" => $data,
            "message" => $message
        ], 201);
    }

    protected function BadRequest($message = "Bad Request")
    {
        return response()->json([
            "ok" => false,
            "message" => $message
        ], 400);
    }

    protected function Unauthenticated($message = "Unauthenticated")
    {
        return response()->json([
            "ok" => false,
            "message" => $message
        ], 401);
    }

    protected function Forbidden($message = "Forbidden")
    {
        return response()->json([
            "ok" => false,
            "message" => $message
        ], 403);
    }

    protected function NotFound($message = "Not Found")
    {
        return response()->json([
            "ok" => false,
            "message" => $message
        ], 404);
    }

    protected function ValidateName(&$data, &$error_msg, $label)
    {
        if (empty($data)) {
            $error_msg = "$label is required.";
            return;
        }

        $data = ucwords($data, " -'");
        $data = preg_replace("/[ ]{2,}/", " ",$data);

        if (strlen($data) > 255) {
            $error_msg = "$label should not exceed 255 characters";
            return;
        }

        if (preg_match("/^[^a-zA-Z]/", $data) || preg_match("/[^a-zA-Z]$/", $data)) {
            $error_msg = "$label must start and end with a letter.";
            return;
        }

        if (preg_match("/[\d]+/", $data)) {
            $error_msg = "$label must not contain any numbers.";
            return;
        }

        if (preg_match("/[^a-zA-Z\-' ]/", $data)) {
            $error_msg = "$label only allows special characters (-,')";
            return;
        }
    }

    protected function ValidateEmail($data, &$error_msg)
    {
        if (empty($data)) {
            $error_msg = "Email address is required";
            return;
        }

        if (strlen($data) > 255) {
            $error_msg = "Email address should not exceed 255 characters";
            return;
        }

        $disposableDomains = explode("\n", Storage::get("/disposable_email_blocklist.conf"));

        $domain = strtolower(explode("@", $data)[1]);

        if (in_array($domain, $disposableDomains)) {
            $error_msg = "Disposable domains are not allowed.";
            return;
        }

        if (!(filter_var($data, FILTER_VALIDATE_EMAIL))) {
            $error_msg = "Email address must be valid,";
            return;
        }

        $user = User::where("email", "=", "$data")->first();

        if ($user) {
            $error_msg = "Email address is already taken,";
            return;
        }
    }

    protected function ValidatePhoneNumber($data, &$error_msg)
    {
        if (empty($data)) {
            $error_msg = "Phone number is required";
            return;
        }

        if (!(preg_match("/^(?:\+63|0)9\d{9}$/", $data))) {
            $error_msg = "Phone number should be a valid Philippine (PH) phone number.";
            return;
        }

        $number = substr($data, -10);

        $user = Profile::whereLike("phone_number", "%$number")->first();

        if ($user) {
            $error_msg = "Phone number is already taken,";
            return;
        }
    }

    protected function ValidatePassword($password, $confirmPassword, &$error_msg)
    {
        if (empty($password)) {
            $error_msg = "Password is required";
            return;
        }

        if (empty($confirmPassword)) {
            $error_msg = "Password Confirmation is required";
            return;
        }

        if (strlen($password) > 255) {
            $error_msg = "Password should not exceed 255 characters";
            return;
        }

        if (strlen($password) < 8) {
            $error_msg = "Password should be atleast 8 characters.";
            return;
        }

        if (!(preg_match("/^(?=.*[^a-zA-Z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/", $password))) {
            $error_msg = "Password must contain: Special Character, Uppercase letter, Lowercase letter, and a Number";
            return;
        }

        $array_data = str_split($password);
        $array_data = array_unique($array_data);

        if (count($array_data) < 5) {
            $error_msg = "Password should have atleast 5 unique characters.";
            return;
        }

        if ($password !== $confirmPassword) {
            $error_msg = "Password does not match";
            return;
        }
    }
}
