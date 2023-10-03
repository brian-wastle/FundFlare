import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!, $isAdmin: Boolean) {
    addUser(username: $username, email: $email, password: $password, isAdmin: $isAdmin) {
      token
      user {
        _id
        username
        isAdmin
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_ORGANIZATION = gql`
  mutation saveOrganization($saveOrganizationInput: saveOrganizationInput!) {
    saveOrganization(input: $saveOrganizationInput) {
      _id
      username
      savedOrganizations {
        name
      }
    }
  }
`;

export const REMOVE_ORGANIZATION = gql`
  mutation removeOrganization($organizationId: ID!) {
    removeOrganization(organizationId: $organizationId) {
      _id
      username
      savedOrganizations {
        name
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($input: addUserInput!) {
    updateUser(input: $input) {
      _id
      username
      email
      isAdmin
      savedOrganizations {
        name
        description
      }
      orderHistory {
        orderId
      }
      image
      organizationCount
    }
  }
`;

export const ADD_ORGANIZATION = gql`
  mutation addOrganization($input: addOrganizationInput!) {
    addOrganization(input: $input) {
      _id
      userId
      name
      description
      image
      link
    }
  }
`;

export const ADD_ORDER = gql`
  mutation addOrder($addOrderInput: addOrderInput!) {
    addOrder(input: $addOrderInput) {
      _id
      orderId
      userId
      orderTotal
      orderDate
      paymentStatus
      organizationName
    }
  }
`;