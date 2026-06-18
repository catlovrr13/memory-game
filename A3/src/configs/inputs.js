import { handleEmail, handleName, handlePassword, handlePasswordConfirm, handlePhoneNumber } from "./handlers";

const inputs = [
  {
    id: "first_name",
    label: "First Name",
    type: "text",
    handleOnBlur: handleName
  },
  {
    id: "last_name",
    label: "Last Name",
    type: "text",
    handleOnBlur: handleName
  },
  {
    id: "email",
    label: "Email Address",
    type: "email",
    handleOnBlur: handleEmail
  },
  {
    id: "phone_number",
    label: "Phone Number",
    type: "text",
    handleOnBlur: handlePhoneNumber
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    handleOnBlur: handlePassword
  },
  {
    id: "password_confirmation",
    label: "Repeat Password",
    type: "password",
    handleOnBlur: handlePasswordConfirm
  },
];

export default inputs