import {
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  shouldRefreshToken,
  isAuthenticated,
  isRefreshTokenExpired,
} from "./tokenManager";
import { REFRESH_TOKEN } from "../graphql/mutation/login";

/**
 * Token Refresh Service
 * Handles automatic token refresh with retry logic and error handling
 * Uses dynamic import of Apollo Client to avoid circular dependency
 */

let isRefreshing = false;
let refreshSubscribers = [];
let cachedClient = null;

/**
 * Get Apollo Client lazily to avoid circular dependency
 */
const getClient = async () => {
  if (!cachedClient) {
    const { client } = await import("../config/apolloClient");
    cachedClient = client;
  }
  return cachedClient;
};

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
 * Uses dynamic import of Apollo Client to avoid circular dependency
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
    console.error("❌ No refresh token available - cannot refresh");
    clearAuthTokens();
    // Trigger logout event
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return null;
  }

  isRefreshing = true;
  console.log("🔄 Attempting to refresh access token...");

  try {
    // Get Apollo Client lazily to avoid circular dependency
    const client = await getClient();
    
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: { token: refreshToken },
      fetchPolicy: "no-cache",
      context: {
        // Skip the authLink for this request to avoid infinite loop
        skipAuth: true,
      },
    });

    if (data?.refreshToken?.token) {
      const {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        user,
      } = data.refreshToken;

      // Store new tokens
      setAuthTokens(newAccessToken, newRefreshToken, user);

      // Notify all waiting requests
      onTokenRefreshed(newAccessToken);

      isRefreshing = false;
      console.log("✅ Token refreshed successfully");
      return newAccessToken;
    } else {
      throw new Error("Invalid refresh token response - no token in response");
    }
  } catch (error) {
    console.error("❌ Token refresh failed:", error.message || error);

    // Check if it's a refresh token expiration error
    const isTokenExpired =
      error.message?.includes("Token is invalid or expired") ||
      error.message?.includes("jwt expired") ||
      error.message?.includes("refresh token") ||
      error.message?.includes("expired") ||
      error.graphQLErrors?.[0]?.message?.includes("expired");

    if (isTokenExpired) {
      console.error("🚨 Refresh token has expired - user must login again");
    }

    // Clear auth data
    clearAuthTokens();
    isRefreshing = false;

    // Notify waiting requests with null
    onTokenRefreshed(null);

    // Trigger logout event to update UI
    window.dispatchEvent(new CustomEvent("forceLogout"));

    // Only redirect if we're not already on login page
    if (
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/"
    ) {
      console.log("🔄 Redirecting to login page...");
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
  // First check if we have any tokens at all
  const hasRefresh = !!getRefreshToken();

  if (!hasRefresh) {
    console.error("❌ No refresh token - cannot ensure valid token");
    clearAuthTokens();
    // Trigger logout event
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return false;
  }

  // Check if refresh token itself is expired (time-based check)
  if (isRefreshTokenExpired()) {
    console.error("🚨 Refresh token has expired (time-based) - logging out");
    clearAuthTokens();
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return false;
  }

  if (!isAuthenticated()) {
    // Access token missing but refresh token exists - try to recover
    console.log("⚠️ Access token missing, attempting recovery...");
    const newToken = await refreshAccessToken();
    return !!newToken;
  }

  if (shouldRefreshToken()) {
    console.log("⏰ Token is old, refreshing...");
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
  const refreshExpired = isRefreshTokenExpired();

  console.log("🔐 Initializing auth...", {
    hasAccess,
    hasRefresh,
    refreshExpired,
  });

  // Case 1: No tokens at all - user not logged in
  if (!hasAccess && !hasRefresh) {
    console.log("❌ No tokens found - user not logged in");
    return false;
  }

  // Case 2: Refresh token is expired - logout
  if (refreshExpired) {
    console.error("🚨 Refresh token has expired - user must login again");
    clearAuthTokens();
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return false;
  }

  // Case 3: Has access token - check if needs refresh
  if (hasAccess) {
    console.log("✅ Access token found");
    if (shouldRefreshToken()) {
      console.log("⚠️ Token is old, refreshing...");
      const newToken = await refreshAccessToken();
      return !!newToken;
    }
    return true;
  }

  // Case 4: Access token missing but refresh token exists and is valid
  // This happens when user comes back after access token expired (>10 min)
  if (!hasAccess && hasRefresh && !refreshExpired) {
    console.log(
      "⚠️ Access token missing but refresh token exists - attempting recovery..."
    );
    const newToken = await refreshAccessToken();
    if (newToken) {
      console.log("✅ Token recovered successfully!");
      return true;
    } else {
      console.log("❌ Token recovery failed - logging out");
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
    console.log("❌ Auth initialization failed - not starting auto-refresh");
    // Trigger logout event
    window.dispatchEvent(new CustomEvent("forceLogout"));
    return false;
  }

  console.log("✅ Starting auto-refresh service...");

  // Check token every 3 minutes (ensures we catch 8-minute threshold)
  autoRefreshInterval = setInterval(async () => {
    const hasRefresh = !!getRefreshToken();
    const hasAccess = isAuthenticated();

    console.log("🔄 Auto-refresh check...", { hasAccess, hasRefresh });

    // If both tokens are missing, stop auto-refresh and logout
    if (!hasRefresh) {
      console.error(
        "🚨 No refresh token found - stopping auto-refresh and logging out"
      );
      stopAutoRefresh();
      clearAuthTokens();
      // Trigger logout event
      window.dispatchEvent(new CustomEvent("forceLogout"));

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/";
      }
      return;
    }

    // Try to ensure we have a valid token
    const isValid = await ensureValidToken();

    if (!isValid) {
      console.error("⚠️ Token validation failed - stopping auto-refresh");
      stopAutoRefresh();
    }
  }, 3 * 60 * 1000); // 3 minutes

  return true;
};

export const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
    console.log("⏹️ Auto-refresh stopped");
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
