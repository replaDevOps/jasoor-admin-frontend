// AuthContext.js
import { createContext, useState, useEffect } from 'react';
import { 
  isAuthenticated, 
  setAuthTokens,
  getUserData 
} from '../shared/tokenManager';
import { 
  startAutoRefresh, 
  stopAutoRefresh, 
  handleLogout as serviceLogout 
} from '../shared/tokenRefreshService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userData, setUserData] = useState(getUserData());
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth and start auto-refresh on app load
  useEffect(() => {
    const initAuth = async () => {
      console.log('🚀 AuthProvider: Initializing...');
      
      // Start auto-refresh service (it will handle auth recovery)
      const success = await startAutoRefresh();
      
      if (success) {
        setIsLoggedIn(true);
        setUserData(getUserData());
        console.log('✅ AuthProvider: Initialized successfully');
      } else {
        setIsLoggedIn(false);
        setUserData({});
        console.log('❌ AuthProvider: Not authenticated');
      }
      
      setIsInitializing(false);
    };

    initAuth();

    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
    };
  }, []);

  const login = (token, refreshToken, user) => {
    setAuthTokens(token, refreshToken, user);
    setIsLoggedIn(true);
    setUserData(getUserData());
    
    // Start auto-refresh after login
    startAutoRefresh();
  };

  const logout = () => {
    serviceLogout();
    setIsLoggedIn(false);
    setUserData({});
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      login, 
      logout, 
      userData,
      isInitializing 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
