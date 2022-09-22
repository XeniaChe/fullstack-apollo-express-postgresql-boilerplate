const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

const resolvers = require('./resolvers/index');
const schema = require('./schema/index');
const models = require('./models');

const app = express();
app.use(cors());

const init = async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
      // Pass the static data to each resolver
      models,
      me: models.users[20000000],
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
};

init();
