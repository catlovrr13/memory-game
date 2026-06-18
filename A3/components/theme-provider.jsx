import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState(user?.theme ?? "light");

  useEffect(() => {
    if (user?.theme) {
      setTheme(user?.theme);
    }
  }, [user?.theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) throw new Error("useTheme must be wrapped in ThemeProvider");

  return context;
};
