/* const { messages, users } = require('./models');
// To keep resolvers func-s pure
// operate on models data got from context
// rather then on direct import
 */

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
};

module.exports = resolvers;
