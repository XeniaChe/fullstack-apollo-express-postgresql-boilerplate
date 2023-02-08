const { skip, combineResolvers } = require('graphql-resolvers');
const { AuthenticationError, ForbiddenError } = require('apollo-server');
// To throw Customized error
const { GraphQLError } = require('graphql');

const isAuthenticated = (_, args, { me }) => {
  return me ? skip : new AuthenticationError('Not authenticated as user.');
};

const isMessageOwner = async (_, args, { models, me }) => {
  try {
    const message = await models.Message.findByPk(id, { raw: true });

    if (message.id !== me.id) {
      throw new ForbiddenError('Not authenticated as owner.');
    }

    return skip; // here 'skip' is like next() in Express middleware
  } catch (error) {
    // To throw Customized error
    throw new GraphQLError(error.message, {
      extensions: { code: 'TEST_CODE' },
    });
  }
};

const isAdmin = combineResolvers(isAuthenticated, (_, args, { me }) => {
  return me.role === 'ADMIN'
    ? skip
    : new ForbiddenError('Not authorized as admin.');
});

module.exports = { isAuthenticated, isMessageOwner, isAdmin };
