import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type Charger @key(fields: "id") {
    id: ID!
    serialNumber: String
    vendor: String
    productName: String
    color: String
    status: String
    userId: String
    user: User
  }

  input ChargerInput {
    serialNumber: String
    vendor: String
    productName: String
    color: String
    status: String
    userId: String
  }

  input ChargerUpdateInput {
    id: String!
    serialNumber: String
    vendor: String
    productName: String
    color: String
    status: String
    userId: String
  }

  type Query {
    chargers: [Charger]
  }

  type Mutation {
    addCharger(charger: ChargerInput!): Charger
    deleteCharger(id: String!): String
    updateCharger(charger: ChargerUpdateInput!): Charger
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    chargers: [Charger]
  }
`;
