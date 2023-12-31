import { gql } from '@apollo/client';

export const GET_SINGLE_USER = gql`
  query getSingleUser {
    getSingleUser {
      _id
      username
      email
      isAdmin
      savedOrganizations {
        _id
        userId {
      username
      _id
      image
    }
        name
        description
        image
        link
        tag {
      image
      name
      _id
    }
      }
      orderHistory {
        orderId
        userId
        orderTotal
        orderDate
        organizationName
      }
      image
      organizationCount
      myOrganizationId
    }
  }
`;

export const GET_SINGLE_ORGANIZATION = gql`
  query getSingleOrganization($organizationId: String!) {
    getSingleOrganization(organizationId: $organizationId) {
      _id
      userId {
      username
      _id
      image
    }
      name
      description
      image
      link
      tag {
      image
      name
      _id
    }
      fundraisingGoal
      fundraisingAmount
    }
  }
`;

export const GET_ORGANIZATIONS = gql`
  query getOrganizations {
    getOrganizations {
      _id
      userId {
      username
      _id
      image
    }
      name
      description
      image
      link
      tag {
      image
      name
      _id
    }
      fundraisingGoal
      fundraisingAmount
    }
  }
`;

export const GET_ORGS_BY_TAGID = gql`
  query getOrgsByTagId($tagId: String!) {
    getOrgsByTagId(tagId: $tagId) {
      _id
      userId {
      username
      _id
      image
    }
      name
      description
      image
      link
      tag {
      image
      name
      _id
    }
      fundraisingGoal
      fundraisingAmount
    }
  }
`;

export const GET_SEARCH = gql`
  query getSearch($searchParams: String!) {
    getSearch(searchParams: $searchParams) {
      _id
      userId {
      username
      _id
      image
    }
      name
      description
      image
      link
      tag {
      image
      name
      _id
    }
      fundraisingGoal
      fundraisingAmount
    }
  }
`;

export const GET_SINGLE_ORDER = gql`
  query getSingleOrder($orderId: String!) {
    getSingleOrder(orderId: $orderId) {
      _id
      orderId
      userId
      orderTotal
      orderDate
      organizationName
    }
  }
`;

export const GET_ORDERS_BY_USER_ID = gql`
  query getOrdersByUserId($userId: String!) {
    getOrdersByUserId(userId: $userId) {
      _id
      orderId
      userId
      orderTotal
      orderDate
      organizationName
    }
  }
`;

export const GET_ORDERS_BY_ORG_NAME = gql`
  query getOrdersByOrgName($organizationName: String!) {
    getOrdersByOrgName(organizationName: $organizationName) {
      orderId
      userId
      orderTotal
      orderDate
      organizationName
    }
  }
`;

export const GET_SINGLE_TAG = gql`
  query getSingleTag($tagId: String!) {
    getSingleTag(tagId: $tagId) {
      name
      image
    }
  }
`;

export const GET_TAG_BY_NAME = gql`
  query getTagByName($tagName: String!) {
    getTagByName(tagName: $tagName) {
      _id
    }
  }
`;

export const GET_ALL_TAGS = gql`
query getAllTags {
  getAllTags {
    _id
    name
    image
  }
}
`;