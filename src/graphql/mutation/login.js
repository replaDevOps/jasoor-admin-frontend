import { gql } from "@apollo/client";

export const CREATE_USER = gql`
    mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
        id
  }
}
`

export const LOGIN = gql`
    mutation Login($password: String!, $email: String) {
  login(password: $password, email: $email) {
    token
    user {
      id
    }
  }
}
`

export const LOGOUT = gql`
    mutation Logout {
  logout {
    message
  }
}
`