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

export const CREATE_ROLE = gql`
    mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    id
  }
}
`
export const UPDATE_SETTING = gql`
mutation UpdateSettings($updateSettingsId: ID!, $commissionRate: String, $faceBook: String, $instagram: String, $whatsApp: String, $x: String, $email: String) {
  updateSettings(id: $updateSettingsId, commissionRate: $commissionRate, faceBook: $faceBook, instagram: $instagram, whatsApp: $whatsApp, x: $x, email: $email) {
    id
  }
}
`
export const CHANGE_ADMIN_PASSWORD = gql`
mutation AdminChangePassword($adminChangePasswordId: ID, $oldPassword: String, $newPassword: String) {
  adminChangePassword(id: $adminChangePasswordId, oldPassword: $oldPassword, newPassword: $newPassword)
}
`
export const ADD_ADMIN_BANK = gql`
mutation AddAdminBank($input: BankInput!, $addAdminBankId: ID) {
  addAdminBank(input: $input, id: $addAdminBankId) {
    id
  }
}
`