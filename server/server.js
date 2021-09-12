const express = require('express');
const path = require('path');
const db = require('./config/connection');


// Added this for graphQL
const {ApolloServer} = require('apollo-server-express');
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');


// const routes = require('./routes'); // remove as not need for graphql


const app = express();
const PORT = process.env.PORT || 3001;

// initialized Apollo server and added middleware
const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  context: authMiddleware 
});

// linked middleware to exprss
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// linked express to graphQL
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.use(routes); // remove as not need for graphql

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`); //added graphql
  });
});