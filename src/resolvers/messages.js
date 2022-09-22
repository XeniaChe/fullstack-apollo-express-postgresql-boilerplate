/* const { messages, users } = require('./models');
// To keep resolvers func-s pure
// operate on models data got from context
// rather then on direct import
 */
const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    messages: (_, args, { models }) => Object.values(models.messages),
    getSpecMsg: (_, args, { models }) => models.messages[args.id],
  },

  Message: {
    userCreator: (root, _, { models }) => models.users[root.userId],
  },

  Mutation: {
    createMessage: (_, args, { me, models }) => {
      const newMsg = { id: uuidv4(), text: args.text, userId: me.id };

      models.messages[newMsg.id] = newMsg;
      models.users[me.id].messageIds.push(newMsg.id);

      return newMsg;
    },

    deleteMessage: (_, args, { me, models }) => {
      const { [args.id]: message, ...otherMsgs } = models.messages;

      if (!message) return false;

      models.messages = otherMsgs;

      models.users[me.id].messageIds = models.users[me.id].messageIds.filter(
        (id) => id !== +args.id
      );

      return true;
    },
  },
};

module.exports = resolvers;
