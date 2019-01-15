const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLID
} = require("graphql");

const {globalIdField,connectionDefinitions}=require("graphql-relay");
const { nodeInterface }= require("../interface/Node");

const AuthorModel=require('../models/AuthorModel');
const UserModel = require('../models/UserModel');
const BookModel=require('../models/BookModel');

const User = new GraphQLObjectType({
  name:'User',
  description:"User Type",
  interfaces: [nodeInterface],
  fields:()=>({
    id:globalIdField(),
    username:{
      type:new GraphQLNonNull(GraphQLString),
    },
    email:{
      type:new GraphQLNonNull(GraphQLString),
    },
    fullname:{
      type:new GraphQLNonNull(GraphQLString),
    }
  })

});

const Author = new GraphQLObjectType({
  name:'Author',
  description:"return Author Type",
  interfaces: [nodeInterface],
  fields:()=>(  {
      id:globalIdField(),
      name:{
        type:new GraphQLNonNull(GraphQLString),
      },
      age:{
        type:new GraphQLNonNull(GraphQLInt),
      },
      birthPlace:{
        type:new GraphQLNonNull(GraphQLString),
      },
      books: {
        type:new GraphQLList(Book),
        resolve: author=>BookModel.getAuthorBooks(author.id)
      }
    })

});

const Book = new GraphQLObjectType({
  name:'Book',
  description:"return book type",
  interfaces: [nodeInterface],
  fields:()=>({
    id:globalIdField(),
    title:{
      type:new GraphQLNonNull(GraphQLString),
    },
    description:{
      type:new GraphQLNonNull(GraphQLString),
    },
    author:{
      type:Author,
      resolve: (parent)=>AuthorModel.getAuthor(parent.authorid)
    },
    comments: {
      type:GraphQLList(Comment)
    }
  })
});


const Comment = new GraphQLObjectType({
  name:'Comment',
  fields:()=>(  {
      user:{
        type:User,
        resolve: (parent)=>{
          return UserModel.getUser(parent.userid);
        }
      },
      comment:{
        type:new GraphQLNonNull(GraphQLString),
      },
      commentdate:{
        type:new GraphQLNonNull(GraphQLString),
        resolve: comment=>comment.commentdate.toString()
      },
    })
});
const CreateAuthorInput = new GraphQLInputObjectType({
  name:'CreateAuthorInput',
  fields:  {
      name:{
        type:new GraphQLNonNull(GraphQLString),
          },
      age:{
        type:new GraphQLNonNull(GraphQLInt),
          },
      birthPlace:{type:new GraphQLNonNull(GraphQLString)}
    }

});
const AddCommentInput= new GraphQLInputObjectType({
  name:'AddCommentInputType',
  fields:{
      bookid:{type:new GraphQLNonNull(GraphQLID)},
      userid:{
        type:new GraphQLNonNull(GraphQLID),
          },
      comment:{
        type:new GraphQLNonNull(GraphQLString),
          },
        }

});
const CreateBookInput = new GraphQLInputObjectType({
  name:'CreateBookInput',
  fields:{
      title:{
        type:new GraphQLNonNull(GraphQLString),
          },
      description:{
        type:new GraphQLNonNull(GraphQLString),
          },
      authorid:{type:new GraphQLNonNull(GraphQLID)}
    }

});

const UpdateBookInput = new GraphQLInputObjectType({
  name:'UpdateBookInputType',
  fields:{
      id: { type:GraphQLID},
      title:{
        type:GraphQLString,
          },
      description:{
        type:GraphQLString,
          },
      authorid:{type:GraphQLID}
    }

});

const CreateUserInput = new GraphQLInputObjectType({
  name:'CreateUserInput',
  description:"return User Create Type",
  fields:{
    username:{
      type:new GraphQLNonNull(GraphQLString),
        },
    email:{
      type:new GraphQLNonNull(GraphQLString),
        },
    password:{type:new GraphQLNonNull(GraphQLString)},
    fullname:{
      type:new GraphQLNonNull(GraphQLString),
        }
  }

});

const { connectionType: AuthorConnection}= connectionDefinitions({nodeType:Author});
const { connectionType: BookConnection } = connectionDefinitions({nodeType:Book});
const { connectionType: UserConnection } = connectionDefinitions({nodeType:User});

module.exports={
  Book,CreateBookInput,UpdateBookInput,
  User,CreateUserInput,
  Author,CreateAuthorInput,AddCommentInput,Comment,
  AuthorConnection,BookConnection,UserConnection
};
