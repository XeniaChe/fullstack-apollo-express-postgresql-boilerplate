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
    email: String!
    address: Address
    messages: [Message!]
  }
  type Token {
    token: String!
  }

  type Mutation {
    signUp(username: String!, password: String!, email: String!): Token!
  }
`;

module.exports = userSchema;
