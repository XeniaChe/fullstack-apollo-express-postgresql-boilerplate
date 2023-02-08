const { gql } = require('apollo-server-express');
const userSchema = require('./users');
const messageSchema = require('./messages');

const linkedSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

module.exports = [linkedSchema, userSchema, messageSchema];
