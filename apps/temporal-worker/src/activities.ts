
import { getContext } from './logger_interceptor';
import { FetchPolicy, gql } from '@apollo/client/core';
import { getOperationDefinition } from '@apollo/client/utilities';
import { apolloClient } from './graphql/apollo-client';
import { MutationFetchPolicy } from '@apollo/client/core/watchQueryOptions';

export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

export async function graphQLRequest(queryString: string, variables?: {}, fetchPolicy?: FetchPolicy | MutationFetchPolicy): Promise<any> {
  const { logger } = getContext();
  const graphQLRequest = gql`${queryString}`;
  logger.info("GraphQL Info : " + graphQLRequest)

  if (getOperationDefinition(graphQLRequest).operation === 'query') {
    return await apolloClient.query({
      query: graphQLRequest,
      variables: variables,
      fetchPolicy: fetchPolicy as FetchPolicy
    })
  } else if (getOperationDefinition(graphQLRequest).operation === 'mutation') {
    return await apolloClient.mutate({
      mutation: graphQLRequest,
      variables: variables,
      fetchPolicy: fetchPolicy as MutationFetchPolicy
    })
  }
}
