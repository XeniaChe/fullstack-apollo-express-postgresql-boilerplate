/* const { messages, users } = require('./models');
// To keep resolvers func-s pure
// operate on models data got from context
// rather then on direct import
 */

const resolvers = {
  Query: {
    messages: async (_, args, { models }) => {
      try {
        return await models.Message.findAll();
      } catch (error) {
        throw new Error('Custom error message');
      }
    },
    getSpecMsg: async (_, args, { models }) => {
      try {
        return await models.Message.findByPk(args.id);
      } catch (error) {
        throw new Error('Custom error message');
      }
    },
    getAllMsgsByUser: async (_, args, { models }) => {
      try {
        const msgs = await models.Message.findAll({
          where: { userId: args.userId },
        });

        return msgs.length ? [...msgs] : [];
      } catch (error) {
        throw new Error('Custom error message');
      }
    },
  },

  Message: {
    userCreator: async (root, _, { models }) => {
      try {
        const user = await models.User.findOne({ where: { id: root.userId } });
        return user;
      } catch (error) {
        throw new Error('Custom error message');
      }
    },
  },

  Mutation: {
    createMessage: async (_, args, { me, models }) => {
      try {
        const newMsg = { text: args.text, userId: me.id };

        // Sve new Msg to DB
        return await models.Message.create({ ...newMsg });
      } catch (error) {
        throw new Error('Custom error message');
      }
    },

    deleteMessage: async (_, args, { models }) => {
      try {
        await models.Message.destroy({ where: { id: args.id } });

        return true;
      } catch (error) {
        throw new Error('Custom error message');
      }
    },
  },
};

module.exports = resolvers;
