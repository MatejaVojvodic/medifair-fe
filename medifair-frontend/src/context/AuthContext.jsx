// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { isAuthenticated, logout, setupAuthInterceptor } from "../api/authService"; // Fixed casing

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      if (authenticated) {
        setupAuthInterceptor();
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};