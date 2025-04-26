import axios from "axios";

const API_URL = "http://localhost:8080";

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    
    // Store the JWT token in localStorage
    if (response.data) {
      localStorage.setItem("token", response.data);
      // Set the token in axios default headers for future requests
      setAuthHeader(response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  setAuthHeader(null);
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    setAuthHeader(token);
    return true;
  }
  return false;
};

export const setupAuthInterceptor = () => {
    const token = getToken();
    if (token) {
      setAuthHeader(token);
    }
  };