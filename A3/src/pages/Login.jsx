import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { NavLink } from "react-router";
import { loginInputs } from "../configs/loginInputs";
import WithGuest from "../hoc/WithGuest";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const [warnings, setWarnings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempWarnings = { ...warnings };

    for (let i = 0; i < loginInputs.length; i++) {
      const target = document.getElementById(loginInputs[i].id);
      tempWarnings = loginInputs[i].handleOnBlur({ target }, tempWarnings);
    }
    setWarnings(tempWarnings);

    try {
      setIsLoading(true);
      const res = await login(formData);

      if (!res.ok) {
          setWarnings((prev) => ({ ...prev, ...res.message }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form className="border border-black p-2 w-90">
        {loginInputs.map((i) => (
          <div key={i.id} className="flex flex-col">
            <label htmlFor={i.id}>{i.label}</label>
            <input
              type={i.type}
              id={i.id}
              className="border border-black p-1"
              onBlur={(e) => {
                i.handleOnBlur(e, warnings, setWarnings);
              }}
              onChange={(e) => {
                setFormData({ ...formData, [i.id]: e.target.value });
              }}
            />
            {warnings?.[i.id] ? (
              <small className="text-red-500">{warnings[i.id]}</small>
            ) : null}
          </div>
        ))}
            {/* {warnings ? (
              <small className="text-red-500">{warnings}</small>
            ) : null} */}
        <Button
          className="w-full mt-2"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Loading.." : "Login"}
        </Button>
        <span className="justify-center items-center flex">
          Don't have an account?{" "}
          <NavLink className="text-blue-400" to="/">
            Register Now
          </NavLink>
        </span>
      </form>
    </div>
  );
}

export default WithGuest(Login);
