const {GraphQLObjectType,GraphQLID,GraphQLString} = require("graphql");
const {Book} = require("./types");
const BOOK_ADDED="BookAdded";
const COMMENT_ADDED="CommentAdded";
const { PubSub } = require("graphql-subscriptions");

const pubsub= new PubSub();

const Subscriptions = new GraphQLObjectType({
  name:"Subscriptions",
  fields: {
    addBook: {
      type:Book,
      subscribe: ()=> { return pubsub.asyncIterator(BOOK_ADDED); }
    },
    addComment: {
      type:Book,
      args: {
        bookid:{type:GraphQLString}
      },
      subscribe : (_,args)=> {
        return pubsub.asyncIterator(`${COMMENT_ADDED}${args.bookid}`);
      }
    }

  }

});



module.exports={Subscriptions,BOOK_ADDED,COMMENT_ADDED,pubsub};
