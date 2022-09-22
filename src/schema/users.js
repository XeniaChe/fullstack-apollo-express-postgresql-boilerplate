const { gql } = require('apollo-server-express');

const userSchema = gql`
  extend type Query {
    me: User
    getSpecUser(id: ID!): User
    users: [User!]
  }

  type Address {
    city: String!
    street: String!
  }

  type User {
    id: ID!
    username: String!
    address: Address
    messages: [Message!]
  }
`;

module.exports = userSchema;
