import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  // --- DEBUG: lecture du token ---
  const storedToken = localStorage.getItem("token");
  console.log("%c[Auth] Token chargé :", "color: #4CAF50", storedToken);

  // --- DEBUG: lecture du user ---
  const storedUserRaw = localStorage.getItem("user");
  console.log("%c[Auth] User brut dans localStorage :", "color: #2196F3", storedUserRaw);

  // Parsing sécurisé du user
  let initialUser = null;
  try {
    initialUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  } catch (err) {
    console.warn("%c[Auth] Erreur JSON.parse(user) → reset user", "color: orange");
    initialUser = null;
  }

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(initialUser);

  // --- LOGIN ---
  function login(token, user) {
    console.log("%c[Auth] LOGIN appelé", "color: #00C853");
    console.log("%c[Auth] Nouveau token :", "color: #00C853", token);
    console.log("%c[Auth] Nouveau user :", "color: #00C853", user);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  }

  // --- LOGOUT ---
  function logout() {
    console.log("%c[Auth] LOGOUT appelé", "color: #D50000");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
