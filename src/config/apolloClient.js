import { ApolloClient, InMemoryCache, createHttpLink, from, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { getAccessToken } from "../shared/tokenManager";

const API_URL = "https://verify.jusoor-sa.co/graphql";

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

// Error Handling Link (Detect expired token)
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error("[GraphQL Error]:", err.message);
      if (
        err.message?.includes("Token is invalid or expired") ||
        err.message?.includes("Invalid token or authentication failed") ||
        err.message?.includes("Unauthorized") ||
        err.extensions?.code === "UNAUTHENTICATED"
      ) {
        // Token refresh will be handled by tokenRefreshService
        // Don't clear tokens here, let the refresh service handle it
        console.warn("⚠️ Authentication error detected - token may need refresh");
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
