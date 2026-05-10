// AuthContext.js
import { createContext, useState, useEffect } from "react";
import {
  isAuthenticated,
  setAuthTokens,
  getUserData,
  getUserRole,
} from "../shared/tokenManager";
import {
  startAutoRefresh,
  stopAutoRefresh,
  handleLogout as serviceLogout,
} from "../shared/tokenRefreshService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userData, setUserData] = useState(getUserData());
  const [userPermissions, setUserPermissions] = useState(getUserRole());
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth and start auto-refresh on app load
  useEffect(() => {
    const initAuth = async () => {
      // Start auto-refresh service (it will handle auth recovery)
      const success = await startAutoRefresh();
      if (success) {
        setIsLoggedIn(true);
        setUserData(getUserData());
        setUserPermissions(getUserRole());
      } else {
        setIsLoggedIn(false);
        setUserData({});
        setUserPermissions(null);
      }

      setIsInitializing(false);
    };

    initAuth();

    // Listen for forced logout events (from Apollo error handler)
    const handleForceLogout = () => {
      setIsLoggedIn(false);
      setUserData({});
      stopAutoRefresh();
    };

    window.addEventListener("forceLogout", handleForceLogout);

    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
      window.removeEventListener("forceLogout", handleForceLogout);
    };
  }, []);

  const login = (token, refreshToken, user) => {
    // Reject Customer accounts — they cannot access the admin panel
    const roleName =
      user?.role?.name ??
      user?.roles?.name ??
      user?.roleName ??
      (typeof user?.role === "string" ? user.role : "");
    const normalizedRole = String(roleName || "").trim().toLowerCase();
    if (!normalizedRole || normalizedRole === "customer") {
      return false;
    }

    setAuthTokens(token, refreshToken, user);
    setIsLoggedIn(true);
    setUserData(getUserData());
    setUserPermissions(getUserRole());

    // Start auto-refresh after login
    startAutoRefresh();
    return true;
  };

  const logout = () => {
    serviceLogout();
    setIsLoggedIn(false);
    setUserData({});
    setUserPermissions(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userData,
        userPermissions,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
