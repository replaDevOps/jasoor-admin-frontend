import { client } from "../config/apolloClient";
import { REFRESH_TOKEN } from "../graphql/mutation/login";
import {
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  shouldRefreshToken,
  isAuthenticated,
} from "./tokenManager";

/**
 * Token Refresh Service
 * Handles automatic token refresh with retry logic and error handling
 */

let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Add callback to be executed after token refresh
 * @param {function} callback - Function to call after refresh
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

/**
 * Execute all pending callbacks after token refresh
 * @param {string} token - New access token
 */
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Refresh the access token using the refresh token
 * @returns {Promise<string|null>} New access token or null on failure
 */
export const refreshAccessToken = async () => {
  // If already refreshing, wait for that to complete
  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.error("No refresh token available");
    clearAuthTokens();
    return null;
  }

  isRefreshing = true;

  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: { token: refreshToken },
    });

    if (data?.refreshToken?.token) {
      const { token: newAccessToken, refreshToken: newRefreshToken, user } = data.refreshToken;

      // Store new tokens
      setAuthTokens(newAccessToken, newRefreshToken, user);

      // Notify all waiting requests
      onTokenRefreshed(newAccessToken);

      isRefreshing = false;
      return newAccessToken;
    } else {
      throw new Error("Invalid refresh token response");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    
    // Clear auth data and redirect to login
    clearAuthTokens();
    isRefreshing = false;
    
    // Only redirect if we're not already on login page
    if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
      window.location.href = "/";
    }
    
    return null;
  }
};

/**
 * Proactive token refresh - call this periodically or before important requests
 * @returns {Promise<boolean>} True if token was refreshed successfully
 */
export const ensureValidToken = async () => {
  if (!isAuthenticated()) {
    return false;
  }

  if (shouldRefreshToken()) {
    const newToken = await refreshAccessToken();
    return !!newToken;
  }

  return true; // Token is still valid
};

/**
 * Initialize authentication on app load
 * Handles the case where access token expired but refresh token still valid
 * This fixes the "stay logged in overnight" scenario
 */
export const initializeAuth = async () => {
  const hasAccess = isAuthenticated();
  const hasRefresh = !!getRefreshToken();

  console.log('🔐 Initializing auth...', { hasAccess, hasRefresh });

  // Case 1: No tokens at all - user not logged in
  if (!hasAccess && !hasRefresh) {
    console.log('❌ No tokens found - user not logged in');
    return false;
  }

  // Case 2: Has access token - check if needs refresh
  if (hasAccess) {
    console.log('✅ Access token found');
    if (shouldRefreshToken()) {
      console.log('⚠️ Token is old, refreshing...');
      const newToken = await refreshAccessToken();
      return !!newToken;
    }
    return true;
  }

  // Case 3: Access token missing but refresh token exists
  // This happens when user comes back after access token expired (>10 min)
  if (!hasAccess && hasRefresh) {
    console.log('⚠️ Access token missing but refresh token exists - attempting recovery...');
    const newToken = await refreshAccessToken();
    if (newToken) {
      console.log('✅ Token recovered successfully!');
      return true;
    } else {
      console.log('❌ Token recovery failed - logging out');
      return false;
    }
  }

  return false;
};

/**
 * Auto-refresh setup - checks token validity every 3 minutes
 * Call this on app initialization
 * Backend config: Access token = 10min, Refresh token = 234h
 * Auto-refresh triggers at 8 minutes (2 min before expiry)
 */
let autoRefreshInterval = null;

export const startAutoRefresh = async () => {
  // Clear any existing interval
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  // First, initialize/recover authentication
  const isAuth = await initializeAuth();
  
  if (!isAuth) {
    console.log('❌ Auth initialization failed - not starting auto-refresh');
    return false;
  }

  console.log('✅ Starting auto-refresh service...');

  // Check token every 3 minutes (ensures we catch 8-minute threshold)
  autoRefreshInterval = setInterval(async () => {
    if (isAuthenticated()) {
      console.log("🔄 Auto-refresh check...");
      await ensureValidToken();
    } else {
      // Stop auto-refresh if user is not authenticated
      console.log('⚠️ No longer authenticated - stopping auto-refresh');
      stopAutoRefresh();
    }
  }, 3 * 60 * 1000); // 3 minutes

  return true;
};

export const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
    console.log('⏹️ Auto-refresh stopped');
  }
};

/**
 * Handle logout - clear tokens and stop auto-refresh
 */
export const handleLogout = () => {
  stopAutoRefresh();
  clearAuthTokens();
  window.location.href = "/";
};
