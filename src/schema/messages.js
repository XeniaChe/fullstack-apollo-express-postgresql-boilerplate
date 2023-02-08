const { gql } = require('apollo-server-express');

const messageSchema = gql`
  extend type Query {
    messages: [Message!]
    getSpecMsg(id: ID!): Message
    getAllMsgsByUser(userId: Int!): [Message]!
  }

  type Message {
    id: ID!
    text: String!
    userCreator: User!
    createdAt: Date!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }
`;

module.exports = messageSchema;
