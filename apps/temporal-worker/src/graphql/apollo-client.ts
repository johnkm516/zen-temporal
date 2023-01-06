import { ApolloClient, createHttpLink, from} from "@apollo/client";
import authLink from './authLink'
import cache from './cache'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL
});

// If you provide a link chain to ApolloClient, you
// don't provide the `uri` option.
export const apolloClient = new ApolloClient({
    link: from([authLink, httpLink]),
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
