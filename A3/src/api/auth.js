import { BASE_URL } from "./config";

export const me = async (token) => {
  const response = await fetch(`${BASE_URL}/user`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const res = await response.json();

  return res;
};

export const Register = async ({
  first_name,
  last_name,
  email,
  phone_number,
  password,
  password_confirmation,
}) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name,
      last_name,
      email,
      phone_number,
      password,
      password_confirmation,
    }),
  });

  const res = await response.json();

  return res;
};

export const Login = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const res = await response.json();
  console.log(res);

  return res;
};

export const Logout = async (token) => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const res = await response.json();
  console.log(res);

  return res;
};

export const UpdateTheme = async ({ token, theme }) => {
  const response = await fetch(`${BASE_URL}/users/theme`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      theme,
    }),
  });

  const res = await response.json();
  console.log(res);

  return res;
};
