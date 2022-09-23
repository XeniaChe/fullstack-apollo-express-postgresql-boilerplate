/* const { messages, users } = require('./models');
// To keep resolvers func-s pure
// operate on models data got from context
// rather then on direct import
 */

const resolvers = {
  Query: {
    me: async (_, args, { me, models }) => await models.User.findByPk(args.id),
    getSpecUser: async (_, args, { me, models }) =>
      await models.User.findByPk(args.id),
    users: async (_, args, { models }) => await models.User.findAll(),
  },

  User: {
    messages: (root, _, { models }) => {
      return root.messageIds.map((id) => models.Message[id]);
    },
  },
};

module.exports = resolvers;
