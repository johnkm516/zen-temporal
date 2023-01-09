import { ApolloClient, createHttpLink, fromPromise } from '@apollo/client'

import { onError } from '@apollo/client/link/error'
import { inMemoryCache } from '../inMemoryCache'

import cache from './cache'
import GET_AUTH_TOKEN from './queries/GET_AUTH_TOKEN'

let isRefreshing = false
let pendingRequests: any[] = []
let authToken = ''
export { authToken };

const setIsRefreshing = (value: boolean) => {
  isRefreshing = value
}

const addPendingRequest = (pendingRequest: any) => {
  pendingRequests.push(pendingRequest)
}

const renewTokenApiClient = new ApolloClient({
  link: createHttpLink({ uri: "http://localhost:7083/graphql" }),
  cache,
  credentials: 'include',
})

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback())
  pendingRequests = []
}

const getNewToken = async () => {
  const {
    data: {
        authLogin: {
            token: accessToken,
        },
    },
  } = await renewTokenApiClient.query({
    query: GET_AUTH_TOKEN,
    variables: {
      data: {
        password: process.env.API_PASSWORD,
        rememberMe: true,
        username: process.env.API_USERNAME
      }
    },
  })!

  await inMemoryCache.setItem("accessToken", accessToken, {ttl: 3600})
}

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err?.message) {
        case 'Unauthorized':
          if (!isRefreshing) {
            setIsRefreshing(true)

            return fromPromise(
              getNewToken().catch(async () => {
                resolvePendingRequests()
                setIsRefreshing(false)
                await inMemoryCache.clear();
                authToken = "";

                renewTokenApiClient!.writeQuery({
                    query: GET_AUTH_TOKEN,
                    data: {
                      password: process.env.API_PASSWORD,
                      rememberMe: true,
                      username: process.env.API_USERNAME
                    }
                })

                return forward(operation)
              }),
            ).flatMap(() => {
              resolvePendingRequests()
              setIsRefreshing(false)

              return forward(operation)
            })
          } else {
            return fromPromise(
              new Promise<void>((resolve) => {
                addPendingRequest(() => resolve())
              }),
            ).flatMap(() => {
              return forward(operation)
            })
          }
      }
    }
  }
})

export default errorLink