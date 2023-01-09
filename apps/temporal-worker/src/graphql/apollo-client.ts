import { ApolloClient, createHttpLink, from} from "@apollo/client";
import { authFlowLink } from "./authLink";

import cache from './cache'

const httpLink = createHttpLink({
  uri: "http://localhost:7083/graphql"
});

// If you provide a link chain to ApolloClient, you
// don't provide the `uri` option.
export const apolloClient = new ApolloClient({
    link: from([authFlowLink, httpLink]),
    cache,
    credentials: 'include',
    defaultOptions: {
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    }
  });
