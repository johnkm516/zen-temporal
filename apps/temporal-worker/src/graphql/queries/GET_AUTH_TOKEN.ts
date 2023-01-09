import { gql } from "@apollo/client";

const GET_AUTH_TOKEN = gql`
    query AuthLogin($data: AuthLoginInput!) {
        authLogin(data: $data) {
            token
        }
    }
`;

export default GET_AUTH_TOKEN;
