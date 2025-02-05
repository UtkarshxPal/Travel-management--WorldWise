import axios from "axios";
import { createContext, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://travel-management-worldwise-backend.onrender.com";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    case "setError":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  async function login(email, password) {
    try {
      if (email && password) {
        const result = await axios.post(
          `${BASE_URL}/user/login`,
          { email, password },
          { withCredentials: true }
        );

        if (result.data.success === "true") {
          dispatch({ type: "login", payload: result.data.user });
          return true; // Added to indicate success
        } else {
          dispatch({
            type: "setError",
            payload: result.data.message || "Login failed",
          });
          return false;
        }
      }
    } catch (err) {
      console.log("Could not login", err);
      dispatch({
        type: "setError",
        payload: err.response?.data?.message || "Could not login",
      });
      return false;
    }
  }

  async function logout() {
    try {
      const result = await axios.post(
        `${BASE_URL}/user/logout`,
        {},
        { withCredentials: true }
      );

      if (result.data.success === "true") {
        dispatch({ type: "logout" });
        return true;
      }
    } catch (err) {
      console.error("Logout failed", err);
      dispatch({
        type: "setError",
        payload: "Logout failed",
      });
      return false;
    }
  }

  async function signup({ name, email, password }) {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      if (response.data.success === "true") {
        // Automatically log in after successful signup
        return await login(email, password);
      } else {
        dispatch({
          type: "setError",
          payload: response.data.message || "Signup failed. Please try again.",
        });
        return false;
      }
    } catch (err) {
      console.log("Could not create account");
      if (err.response?.data?.message) {
        dispatch({
          type: "setError",
          payload: err.response.data.message,
        });
      } else {
        dispatch({
          type: "setError",
          payload: "Signup failed. Please try again.",
        });
      }
      return false;
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, isAuthenticated, logout, signup, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Authentication was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth, AuthContext };
