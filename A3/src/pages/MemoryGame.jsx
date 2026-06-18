import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import gsap from "gsap";
import Cookies from "js-cookie";

import CorrectSound from "../assets/ding correct sound effect.mp3";
import WrongSound from "../assets/wrong sound effect.mp3";
import WithAuth from "../hoc/WithAuth";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import ModeToggle from "../../components/mode-toggle";
import { createScore, getAllScores, getRanks } from "../api/scores";

import { Line } from "react-chartjs-2";

import {
  CategoryScale,
  LinearScale,
  Chart,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
);

function MemoryGame() {
  const { logout } = useAuth();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [gameState, setGameState] = useState(0);
  const [scores, setScores] = useState([]);
  const [ranks, setRanks] = useState([]);

  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const randomNumber = () => {
    return Math.ceil(Math.random() * 9);
  };

  const addToSequence = () => {
    if (sequence.length < level) {
      setSequence([...sequence, randomNumber()]);
    }
  };

  useEffect(() => {
    addToSequence();
    setGameState(1);
  }, [sequence, level]);

  const tl = gsap.timeline();

  const lightUp = () => {
    for (let i = 0; i < sequence.length; i++) {
      tl.to(`.button-${sequence[i]}`, {
        opacity: 0.1,
        duration: 0.5,
        delay: i == 0 ? 1 : 0.5,
      });

      tl.to(`.button-${sequence[i]}`, {
        opacity: 1,
        duration: 0.3,
        onComplete: () => {
          if (i + 1 == sequence.length) {
            setGameState(2);
          }
        },
      });
    }
  };

  useEffect(() => {
    lightUp();
    setGameState(1);
  }, [sequence]);

  const playCorrectSound = () => {
    const audio = new Audio(CorrectSound);
    audio.play();
  };

  const playWrongSound = () => {
    const audio = new Audio(WrongSound);
    audio.play();
  };

  const handleClick = async (num) => {
    if (gameState !== 2) return;

    tl.pause();

    gsap.to(`.button-${num}`, {
      opacity: 0.3,
      duration: 0.1,
      onComplete: () => {
        gsap.to(`.button-${num}`, {
          opacity: 1,
          duration: 0.1,
          onComplete: () => {
            tl.resume();
          },
        });
      },
    });

    if (num == sequence[count]) {
      setScore(score + 1);
      setCount(count + 1);
      playCorrectSound();
    } else {
      setGameState(3);
      playWrongSound();
      const token = Cookies.get("token");
      const res = await createScore({
        score: score,
        level_reached: level,
        token: token,
      });

      const response = await getAllScores(token);
      console.log(response);
      setScores(response?.data);

      const userRanks = await getRanks(token);
      setRanks(userRanks?.data);
    }
  };

  useEffect(() => {
    (async () => {
      const token = Cookies.get("token");
      const userRanks = await getRanks(token);
      setRanks(userRanks?.data);

      const response = await getAllScores(token);
      console.log(response);
      setScores(response?.data);
    })();
  }, []);

  useEffect(() => {
    if (count >= level) {
      setLevel(level + 1);
      setCount(0);
    }
  }, [count]);

  const handlePlayAgain = () => {
    setSequence([]);
    setScore(0);
    setCount(0);
    setLevel(1);
    setGameState(0);
  };

  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");
      const res = await logout(token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center flex-row">
        <div>
          <div className="mb-4">
            <ModeToggle />
          </div>
          <div className="flex m-2">
            <table>
              <thead>
                <tr>
                  <th className="border-3 border-pink p-2">Ranks</th>
                  <th className="border-3 border-pink p-2">User</th>
                  <th className="border-3 border-pink p-2">Score</th>
                  <th className="border-3 border-pink p-2">Level Reached</th>
                </tr>
              </thead>
              <tbody>
                {ranks.map((r, i) => (
                  <tr className="text-center" key={r}>
                    <td className="border-3 border-pink p-2">{i + 1}</td>
                    <td className="border-3 border-pink p-2">
                      {r.profile.first_name}
                    </td>
                    <td className="border-3 border-pink p-2">{r.score}</td>
                    <td className="border-3 border-pink p-2">
                      {r.level_reached}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center flex-col">
          <div className="flex justify-center items-center">
            {gameState === 1 ? (
              <h1 className="p-4 w-70 text-center text-2xl bg-blue-400 rounded-2xl font-bold">
                Game Playing
              </h1>
            ) : gameState === 2 ? (
              <h1 className="p-4 w-70 text-center text-2xl bg-green-400 rounded-2xl font-bold">
                Play the Game!
              </h1>
            ) : gameState === 3 ? (
              <h1 className="p-4 w-70 text-center text-2xl bg-red-600 rounded-2xl font-bold">
                Game Over!
              </h1>
            ) : null}
          </div>
          <div className="flex flex-row gap-5 m-2 text-xl justify-center items-center">
            <h1>Score: {score}</h1>
            <h1>Level: {level}</h1>
          </div>
          <div className="flex flex-wrap w-120 gap-3 justify-center items-center">
            {buttons.map((b) => (
              <Button
                key={b}
                className={`w-30 h-30 button-${b} bg-pink-900 hover:bg-pink-400`}
                onClick={() => {
                  handleClick(b);
                }}
              />
            ))}
          </div>
          {gameState === 3 ? (
            <Button
              onClick={handlePlayAgain}
              className="mt-4"
            >
              Play Again
            </Button>
          ) : null}
          <div className="mt-3 justify-center items-center flex">
            <Button className="bg-red-600" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        {/* <div className="flex flex-1">
          {scores.length > 10 ? (
            <Line
              labels={scores.map((_, i) => i + 1)}
              data={
                  datasets = {
                    label: "Scores",
                    data: { scores },
                    borderWidth: 2,
                    borderColor: "lightpink",
                    backgroundColor: "lightpink",
                  }
              }
            />
          ) : null}
        </div> */}
      </div>
    </>
  );
}
export default WithAuth(MemoryGame);
