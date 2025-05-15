import { createContext, useContext, useEffect, useState } from "react";
import axios from "../axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // Définir le header global (au cas où login() n’a pas été appelé)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const res = await axios.get("/api/me");
        setUser(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        logout(); // Si le token est invalide, on déconnecte proprement
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem("token", tokenValue);
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
