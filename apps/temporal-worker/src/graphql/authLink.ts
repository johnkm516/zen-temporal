import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { inMemoryCache } from "../inMemoryCache";

// cached storage for the user token
let token: string;
const withToken = setContext(() => {
  // if you have a cached value, return it immediately
  if (token) return { token };

  return inMemoryCache.getItem<string>("accessToken").then(userToken => {
    token = userToken;
    return { token };
  });
});

export const authFlowLink = withToken;