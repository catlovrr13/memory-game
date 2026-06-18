import { BASE_URL } from "./config";

export const getAllScores = async (token) => {
    const response = await fetch(`${BASE_URL}/scores`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const res = await response.json();

  return res;
}

export const createScore = async ({ score, level_reached, token }) => {
  const response = await fetch(`${BASE_URL}/scores`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      score, level_reached,
    }),
  });

  const res = await response.json();
  console.log(res);

  return res;
};

export const getRanks = async (token) => {
     const response = await fetch(`${BASE_URL}/scores/ranks`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const res = await response.json();

  return res;
}