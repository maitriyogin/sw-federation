import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    firstName: String
    lastName: String
    email: String
    address: String
    nationalSecurity: String
    age: Int
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
    address: String
    nationalSecurity: String
    age: Int
  }

  input UserUpdateInput {
    id: String!
    firstName: String
    lastName: String
    email: String
    address: String
    nationalSecurity: String
    age: Int
  }

  type Query {
    users: [User]
  }

  type Mutation {
    addUser(user: UserInput!): User
    deleteUser(id: String!): String
    updateUser(user: UserUpdateInput!): User
  }
`;
