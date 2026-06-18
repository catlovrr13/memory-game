<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function index(){
        $scores = auth()->user()->scores;

        return $this->OK($scores);
    }

    public function store(){
        if (!auth()->user()){
            return $this->Unauthenticated();
        }

        $validator = validator(request()->all(), [
            "score" => "required|integer",
            "level_reached" => "required|integer",
        ]);

        
        if ($validator->fails()) {
            return $this->BadRequest($validator->errors());
        }

        $validated = $validator->validated();
        $user_id = auth()->user()->id;

        $score = Score::create([
            "user_id" => $user_id,
            "score" => $validated["score"],
            "level_reached" => $validated["level_reached"],
        ]);

        return $this->Created($score);
    }

    public function ranks(){
        $ranks = Score::with("user.profile")
        ->selectRaw("user_id, MAX(score) as score, MAX(level_reached) as level_reached")->groupBy("user_id")->orderBy("score", "desc")->get()->map(function($score){
            return [
                "score" => $score->score,
                "level_reached" => $score->level_reached,
                "profile" => $score->user->profile,
            ];
        });

        return $this->OK($ranks);
    }
}
