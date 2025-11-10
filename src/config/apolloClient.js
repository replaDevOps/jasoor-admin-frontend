import { ApolloClient, InMemoryCache, createHttpLink, from, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { getAccessToken, clearAuthTokens } from "../shared/tokenManager";
import { refreshAccessToken } from "../shared/tokenRefreshService";

const API_URL = "https://verify.jusoor-sa.co/graphql";

let isRefreshing = false;
let pendingRequests = [];

// HTTP Link
const httpLink = createHttpLink({
  uri: API_URL,
  credentials: "include",
});

// Auth Link (Attaches token)
const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: "wss://verify.jusoor-sa.co/subscriptions",
  options: {
    reconnect: true,
    connectionParams: () => {
      const token = getAccessToken();
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
  },
});

// Split links: send subscriptions to wsLink, others to httpLink
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// Error Handling Link with Token Refresh and Retry
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error("[GraphQL Error]:", err.message);
      
      // Check if it's an authentication error
      if (
        err.message?.includes("Token is invalid or expired") ||
        err.message?.includes("Invalid token or authentication failed") ||
        err.message?.includes("Unauthorized") ||
        err.message?.includes("jwt expired") ||
        err.extensions?.code === "UNAUTHENTICATED"
      ) {
        console.warn("⚠️ Authentication error detected - attempting token refresh...");
        
        // Try to refresh the token
        if (!isRefreshing) {
          isRefreshing = true;
          
          return new Promise((resolve) => {
            refreshAccessToken()
              .then((newToken) => {
                isRefreshing = false;
                
                if (newToken) {
                  console.log("✅ Token refreshed, retrying request...");
                  
                  // Update the operation context with new token
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: `Bearer ${newToken}`,
                    },
                  });
                  
                  // Retry all pending requests
                  pendingRequests.forEach(callback => callback());
                  pendingRequests = [];
                  
                  // Retry the failed operation
                  resolve(forward(operation));
                } else {
                  console.error("❌ Token refresh failed - logging out");
                  // Clear tokens and redirect to login
                  clearAuthTokens();
                  pendingRequests = [];
                  
                  // Trigger logout event
                  window.dispatchEvent(new CustomEvent('forceLogout'));
                  
                  if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
                    window.location.href = "/";
                  }
                  resolve(forward(operation));
                }
              })
              .catch((error) => {
                console.error("❌ Token refresh error:", error);
                isRefreshing = false;
                pendingRequests = [];
                clearAuthTokens();
                
                // Trigger logout event
                window.dispatchEvent(new CustomEvent('forceLogout'));
                
                if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
                  window.location.href = "/";
                }
                resolve(forward(operation));
              });
          });
        } else {
          // If already refreshing, queue this request
          return new Promise((resolve) => {
            pendingRequests.push(() => {
              resolve(forward(operation));
            });
          });
        }
      }
    }
  }
  
  if (networkError) {
    console.error("[Network Error]:", networkError);
  }
});

export const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  cache: new InMemoryCache(),
});
