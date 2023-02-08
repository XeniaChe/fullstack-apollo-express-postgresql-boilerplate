/* const { messages, users } = require('./models');
// To keep resolvers func-s pure
// operate on models data got from context
// rather then on direct import
 */
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');
const { isAdmin } = require('./authentication');

// To throw Customized error
const { GraphQLError } = require('graphql');

const generateToken = async (user, secret, expiresIn) => {
  const { username, id, email, role } = user;

  return await jwt.sign({ username, id, email, role }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    me: async (_, args, { me, models }) => {
      if (!me) return null;

      try {
        return await models.User.findByPk(me.id);
      } catch (error) {
        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },

    getSpecUser: async (_, args, { me, models }) => {
      try {
        return await models.User.findByPk(args.id);
      } catch (error) {
        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },

    users: async (_, args, { models }) => await models.User.findAll(),
  },

  User: {
    messages: async (root, _, { models }) => {
      try {
        return await models.Message.findAll({ where: { userId: root.id } });
      } catch (error) {
        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },
  },

  Mutation: {
    signUp: async (root, args, { models, secret }) => {
      try {
        const newUser = await models.User.create({
          username: args.username,
          email: args.email,
          password: args.password,
          role: 'ADMIN',
        });

        const token = await generateToken(newUser, secret, '30m');
        return { token };
      } catch (error) {
        console.log(error.stack);

        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },

    signIn: async (root, args, { models, secret }) => {
      try {
        const user = await models.User.FindByLogin(args.logIn);

        if (!user)
          throw new UserInputError(
            'No user found with this login credentials.'
          );

        const isValid = await models.User.validatePassword(args.password);

        if (!isValid) throw new AuthenticationError('Wrong password');

        const token = await generateToken(user, secret, '30m');
        return { token };
      } catch (error) {
        console.log(error.stack);

        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },

    deleteUser: combineResolvers(isAdmin, async (root, { id }, { models }) => {
      try {
        const res = await models.User.destroy({
          where: { id },
        });

        return res;
      } catch (error) {
        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    }),

    testError: async (root, args, context) => {
      try {
        const json = JSON.stringify(args.data);

        // return json;
        throw new GraphQLError('test message');
      } catch (error) {
        // To throw Customized error
        throw new GraphQLError(error.message, {
          extensions: { code: 'TEST_CODE' },
        });
      }
    },
  },
};

module.exports = resolvers;
