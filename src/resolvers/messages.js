/* const { messages, users } = require('./models');
// To keep resolvers func-s pure
// operate on models data got from context
// rather then on direct import
 */
const { ForbiddenError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');

// Auth resolver
const { isAuthenticated, isMessageOwner } = require('./authentication');

// To throw Customized error
const { GraphQLError } = require('graphql');

const resolvers = {
  Query: {
    messages: async (_, args, { models }) => {
      try {
        return await models.Message.findAll();
      } catch (error) {
        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },

    getSpecMsg: async (_, args, { models }) => {
      try {
        return await models.Message.findByPk(args.id);
      } catch (error) {
        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },
    getAllMsgsByUser: async (_, args, { models }) => {
      try {
        const msgs = await models.Message.findAll({
          where: { userId: args.userId },
        });

        return msgs.length ? [...msgs] : [];
      } catch (error) {
        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },
  },

  Message: {
    userCreator: async (root, _, { models }) => {
      try {
        const user = await models.User.findOne({ where: { id: root.userId } });
        return user;
      } catch (error) {
        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },
  },

  Mutation: {
    // Combining resolvers
    createMessage: combineResolvers(
      // Check whether the cur user is authenticated
      isAuthenticated,
      async (_, args, { me, models }) => {
        try {
          const newMsg = { text: args.text, userId: me.id };

          // Save new Msg to DB
          return await models.Message.create({ ...newMsg });
        } catch (error) {
          // To throw Customized error
          throw new GraphQLError(error.message, {
            extensions: { code: 'TEST_CODE' },
          });
        }
      }
    ),

    deleteMessage: combineResolvers(
      // Check whether the cur user is authenticated
      isAuthenticated,
      // Check the auth user is the message owner=creator
      isMessageOwner,
      async (_, args, { models }) => {
        try {
          return await models.Message.destroy({ where: { id: args.id } });
        } catch (error) {
          // To throw Customized error
          throw new GraphQLError(error.message, {
            extensions: { code: 'TEST_CODE' },
          });
        }
      }
    ),
  },
};

module.exports = resolvers;
