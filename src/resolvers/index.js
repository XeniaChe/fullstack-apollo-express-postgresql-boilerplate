const userResolvers = require('./users');
const messageResolvers = require('./messages');
const { GraphQLDateTime } = require('graphql-iso-date');

const customScalarResolver = {
  Date: GraphQLDateTime,
};
module.exports = [userResolvers, messageResolvers, customScalarResolver];
