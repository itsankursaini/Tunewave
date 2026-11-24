import { createContext, useContext, useState } from "react";
import { loginUser, registerUser, logoutUser } from "../api/services";

const AuthContext = createContext(null);

// backend has no /me route, so we keep the logged-in user in localStorage
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const saveUser = (u) => {
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (data) => {
    const res = await loginUser(data);
    saveUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    saveUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
