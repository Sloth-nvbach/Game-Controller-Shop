import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

const AUTH_STORAGE_KEY = "game-controller-shop-auth";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  const saveAuth = useCallback((userData, accessToken, refreshToken) => {
    const authData = { user: userData, accessToken, refreshToken };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    setUser(userData);
    setAccessToken(accessToken);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setAccessToken(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!savedAuth) throw new Error("No refresh token");

      const { refreshToken } = JSON.parse(savedAuth);
      if (!refreshToken) throw new Error("No refresh token");

      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Token refresh failed");
      }

      const saved = JSON.parse(savedAuth);
      saveAuth(saved.user, data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      clearAuth();
      throw error;
    }
  }, [clearAuth, saveAuth]);

  const fetchUserProfile = useCallback(async (token) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return res.json();
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
          const { user: savedUser, accessToken: savedToken, refreshToken } = JSON.parse(savedAuth);
          
          if (savedToken) {
            try {
              const userData = await fetchUserProfile(savedToken);
              setUser(userData);
              setAccessToken(savedToken);
            } catch (error) {
              if (refreshToken) {
                try {
                  const newAccessToken = await refreshAccessToken();
                  const userData = await fetchUserProfile(newAccessToken);
                  setUser(userData);
                  setAccessToken(newAccessToken);
                } catch (refreshError) {
                  clearAuth();
                }
              } else {
                clearAuth();
              }
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [clearAuth, fetchUserProfile, refreshAccessToken]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Đăng nhập thất bại.");
    }

    saveAuth(data, data.accessToken, data.refreshToken);

    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Đăng ký thất bại.");
    }

    saveAuth(data, data.accessToken, data.refreshToken);

    return data;
  };

  const logout = () => {
    clearAuth();
  };

  const getAuthHeader = useCallback(() => {
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        login,
        register,
        logout,
        refreshAccessToken,
        getAuthHeader,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin === true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}