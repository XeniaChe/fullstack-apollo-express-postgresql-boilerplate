require('dotenv').config();
const express = require('express');
const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const resolvers = require('./resolvers');
const schema = require('./schema/index');
// Before DB introduced
// const models = require('./models');

// After DB introduced
const { sequelize, models } = require('./models/index');

const app = express();
app.use(cors());

// Populate DB with init data
const createUsersWithMessages = async (date) => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1),
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
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};

// Verify token sent by FE and get the user from it
const verifyToken = async (req) => {
  if (req.headers.authorization) {
    const token = req.headers['authorization'].split(' ')[1];

    if (token) {
      try {
        return await jwt.verify(token, process.env.SECRET);
      } catch (e) {
        throw new AuthenticationError('Your session expired. Sign in again.');
      }
    }
  }
};

const init = async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req }) => {
      let me = await verifyToken(req);

      return {
        // Pass the static data to each resolver
        models,
        secret: process.env.SECRET,
        // User authentication with custom method
        // me: await models.User.FindByLogin('rwieruch'),
        me,
      };
    },
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
        createUsersWithMessages(new Date());
      }

      app.listen({ port: 8000 }, () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
      });
    });
};

init();
