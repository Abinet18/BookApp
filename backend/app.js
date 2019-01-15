const PORT=8000;
const express = require('express');
const jwt=require('jsonwebtoken');
const { execute,subscribe } = require('graphql');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const { graphqlExpress,graphiqlExpress } = require("apollo-server-express");
const { SECRET }=require('./secret.js');
const schema=require('./src/graphql/schema');
const cors=require('cors');

const { SubscriptionServer }  = require('subscriptions-transport-ws');
const subscriptionsEndpoint = `ws://localhost:${PORT}/subscriptions`;


const app = express();

const addUser = async (req) => {
  const token = req.headers.authorization;
  try {
    console.log(SECRET);
    const { user } = await jwt.verify(token, SECRET);
    req.user = user;
  } catch (err) {
    console.log(err);
  }
  req.next();
};

app.use(cors());
app.use(addUser);

app.use('/graphql', bodyParser.json(),graphqlExpress(req=>({
     schema: schema,
     context: {user:req.user,SECRET:SECRET},
     // rootValue:root,
     // pretty: true,
     // graphiql: true,
     // subscriptionsEndpoint:subscriptionsEndpoint

   })));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: subscriptionsEndpoint
}));

const server=createServer(app);
server.listen(PORT,()=>{
  console.log('GraphQL API Server up and running at localhost:' + PORT);
  new SubscriptionServer({
    execute,
    subscribe,
    schema},{
      server:server,
      path:'/subscriptions'
  })
});
