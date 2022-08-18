import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  type Car @key(fields: "id") {
    id: ID!
    registrationNumber: String
    name: String
    vin: String
    model: String
    modelYear: String
    batterySize: Int
    userId: String
    chargerId: String
    user: User
    charger: Charger
  }

  input CarInput {
    registrationNumber: String
    name: String
    vin: String
    model: String
    modelYear: String
    batterySize: Int
    userId: String
    chargerId: String
  }

  input CarUpdateInput {
    id: String!
    registrationNumber: String
    name: String
    vin: String
    model: String
    modelYear: String
    batterySize: Int
    userId: String
    chargerId: String
  }

  type Query {
    cars: [Car]
  }

  type Mutation {
    addCar(car: CarInput!): Car
    deleteCar(id: String!): String
    updateCar(car: CarUpdateInput!): Car
  }

  extend type User @key(fields: "id") {
    id: ID @external
    cars: [Car]
  }

  extend type Charger @key(fields: "id") {
    id: ID @external
    cars: [Car]
  }
`;
