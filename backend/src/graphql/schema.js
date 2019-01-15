const {GraphQLSchema}=require('graphql');
const Query=require("./queries");
const Mutation=require("./mutations");
const {Subscriptions}=require("./subscriptions");
const schema=new GraphQLSchema({
  query: Query,
  mutation:Mutation,
  subscription:Subscriptions
})

module.exports = schema;
