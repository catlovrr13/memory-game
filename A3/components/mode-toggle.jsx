import React from "react";
import { useTheme } from "./theme-provider";
import Cookies from "js-cookie";
import { UpdateTheme } from "../src/api/auth";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const updateUserTheme = async () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);

    const token = Cookies.get("token");
    const res = await UpdateTheme({
      token: token,
      theme: nextTheme,
    });
  };

  const themeIcon = () => {
    if (theme === "dark") return <Moon />;
    return <Sun />
  };

  return (
    <Button size="icon" onClick={updateUserTheme}>
        {themeIcon()}
    </Button>
  )
}
