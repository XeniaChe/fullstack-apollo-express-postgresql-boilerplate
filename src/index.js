require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

const resolvers = require('./resolvers');
const schema = require('./schema/index');
// Before DB introduced
// const models = require('./models');

// After DB introduced
const { sequelize, models } = require('./models/index');

const app = express();
app.use(cors());

// Populate DB with init data
const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    // Populate User with Messages
    {
      include: [models.Message],
    }
  );

  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};

const init = async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async () => ({
      // Pass the static data to each resolver
      models,
      secret: process.env.SECRET,
      // User authentication with custom method
      me: await models.User.FindByLogin('rwieruch'),
    }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Check if connection works
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.\n');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });

  // Erase DB with every app start
  const eraseDatabaseOnSync = true;
  sequelize
    .sync({
      force: eraseDatabaseOnSync,
    })
    .then(async () => {
      if (eraseDatabaseOnSync) {
        createUsersWithMessages();
      }

      app.listen({ port: 8000 }, () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
      });
    });
};

init();
