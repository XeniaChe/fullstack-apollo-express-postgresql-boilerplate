/* const { messages, users } = require('./models');
// To keep resolvers func-s pure
// operate on models data got from context
// rather then on direct import
 */
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server');

const generateToken = async (user, secret, expiresIn) => {
  const { username, id, email } = user;

  return await jwt.sign({ username, id, email }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    me: async (_, args, { me, models }) => {
      if (!me) return null;

      try {
        return await models.User.findByPk(me.id);
      } catch (error) {
        throw new Error('Custom error message');
      }
    },
    getSpecUser: async (_, args, { me, models }) => {
      try {
        return await models.User.findByPk(args.id);
      } catch (error) {
        throw new Error('Custom error message');
      }
    },
    users: async (_, args, { models }) => await models.User.findAll(),
  },

  User: {
    messages: async (root, _, { models }) => {
      try {
        return await models.Message.findAll({ where: { userId: root.id } });
      } catch (error) {
        throw new Error('Custom error message');
      }
    },
  },

  Mutation: {
    signUp: async (root, args, { models, secret }) => {
      const newUser = await models.User.create({
        username: args.username,
        email: args.email,
        password: args.password,
      });

      return { token: await generateToken(newUser, secret, '30m') };
    },

    signIn: async (root, args, { models, secret }) => {
      const user = await models.User.FindByLogin(args.logIn);

      if (!user)
        throw new UserInputError('No user found with this login credentials.');

      const isValid = await models.User.validatePassword(args.password);

      if (!isValid) throw new AuthenticationError('Wrong password');

      return { token: await generateToken(user, secret, '30m') };
    },
  },
};

module.exports = resolvers;
