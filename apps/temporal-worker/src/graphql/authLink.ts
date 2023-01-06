import { ApolloLink } from '@apollo/client'
import { inMemoryCache } from '../inMemoryCache';

type Headers = {
  Authorization?: string
}

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = inMemoryCache.getItem<string>("accessToken").then();

  operation.setContext(({ headers }: { headers: Headers }) => ({
    headers: {
      ...headers,
      Authorization: "Bearer " + accessToken,
    },
  }))

  return forward(operation)
})

export default authLink