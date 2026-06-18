import React, { useState } from "react";
import inputs from "../configs/inputs";
import { Button } from "../../components/ui/button";
import { NavLink } from "react-router";
import WithGuest from "../hoc/WithGuest";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const [warnings, setWarnings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempWarnings = { ...warnings };

    for (let i = 0; i < inputs.length; i++) {
      const target = document.getElementById(inputs[i].id);
      tempWarnings = inputs[i].handleOnBlur({ target }, tempWarnings);
    }
    setWarnings(tempWarnings);

    try {
      setIsLoading(true);
      const res = await register(formData);

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
        {inputs.map((i) => (
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
        <Button
          className="w-full mt-2"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Loading.." : "Register"}
        </Button>
        <span className="justify-center items-center flex">
          Already have an account?{" "}
          <NavLink className="text-blue-400" to="/login">
            Login Now
          </NavLink>
        </span>
      </form>
    </div>
  );
}

export default WithGuest(Register);
