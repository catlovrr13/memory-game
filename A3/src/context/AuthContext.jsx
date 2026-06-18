import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Login, Logout, me, Register } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async (body) => {
      const tempToken = Cookies.get("token");
      try {
        if (tempToken) {
          const res = await me(tempToken);
          setUser(res.data);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const register = useCallback(async (body) => {
    const res = await Register(body);

    if (res.ok) {
      setUser(res.data);
      Cookies.set("token", res.data.token, { expires: 1 });
    }

    setIsLoading(false);
    return res;
  }, []);

  const login = useCallback(async (body) => {
    const res = await Login(body);

    if (res.ok) {
      setUser(res.data);
      Cookies.set("token", res.data.token, { expires: 1 });
    }

    setIsLoading(false);
    return res;
  }, []);

  const logout = useCallback(async (body) => {
    const res = await Logout(body);

    if (res.ok) {
        Cookies.remove("token");
    }

    setIsLoading(false);
    return res;
  }, []);

  return (
    <AuthContext.Provider value={{user, isLoading, register, login, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => { 
    const context = useContext(AuthContext)

    if (!context) throw new Error("useAuth must be wrapped in AuthProvider");

    return context
    
}