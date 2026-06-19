import { createContext } from "react";
import { useState } from "react";
import { useContext, useEffect } from "react";
export const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used with in AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeRole = (r) => (r || "user").toString().trim().toLowerCase();

  const checkAuthStatus = async () => {
    try {
      //logged or not//
      const response = await fetch("http://localhost:5000/api/users/verify", {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 401) {
        setUser(null);
        setLoading(false);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        const role = normalizeRole(data?.user?.role);
        setUser({ ...data.user, role });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  //login
  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        const role = normalizeRole(data?.user?.role);
        setUser({ ...data.user, role });
        localStorage.setItem("user", JSON.stringify({...data?.user, role}));
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (err) {
      console.error("login failed", err);
    }
  };

  //register
  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        const data = await response.json();
        const role = normalizeRole(data?.user?.role);
        setUser({ ...data?.user, role });
        localStorage.setItem("user", JSON.stringify({...data?.user, role}));
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (err) {
      console.error("register failed", err);
    }
  };

  //logout method

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("logout request failed", err);
    } finally {
      setUser(null); //beause token is deleted
      localStorage.removeItem("user");
    }
  };
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    refreshAuth: checkAuthStatus,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default useAuth;
