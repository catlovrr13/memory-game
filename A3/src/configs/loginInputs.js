import { handleEmail, handlePassword } from "./handlers";

export const loginInputs = [
  {
    label: "Email Address",
    id: "email",
    type: "email",
    handleOnBlur: handleEmail,
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    handleOnBlur: handlePassword,
  },
];
