/* const { messages, users } = require('./models');
// To keep resolvers func-s pure
// operate on models data got from context
// rather then on direct import
 */

const myAddress = {
  city: 'WWWW',
  street: 'WWWWWW',
};

const resolvers = {
  Query: {
    me: (_, args, { me }) => ({ ...me, address: { ...myAddress } }),
    getSpecUser: (_, args, { me, models }) => models.users[args.id],
    users: (_, args, { models }) => Object.values(models.users),
  },

  /* 
  // To make all users have the same 'username' and 'id'
  User: { username: () => 'nnnnnnn', id: () => 2 },

  // This's default behaviour (def. reducer)
  // this happens behind the scene. No need to define it explicitly
  // Just an illustration
  // Here 'root' is each user obj. from [users]. Cos Query 'users' is being resolved first
  // next it comes here and pass each user obj. from [users] as 'root'
  User: (root) => ({ username: root.username, id: root.id }), 
  */
  User: {
    messages: (root, _, { models }) => {
      return root.messageIds.map((id) => models.messages[id]);
    },
  },
};

module.exports = resolvers;
