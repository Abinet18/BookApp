const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLID
} = require("graphql");

const AuthorModel=require('../models/AuthorModel');
const UserModel = require('../models/UserModel');
const BookModel=require('../models/BookModel');

const { connectionArgs,connectionFromPromisedArray } = require("graphql-relay");
const {nodeField}= require("../interface/Node");



const {
      Book,CreateBookInput,UpdateBookInput,User,CreateUserInput,
      Author,CreateAuthorInput,AddCommentInput,Comment,
      AuthorConnection,BookConnection,UserConnection }= require('./types.js');

const Viewer=new GraphQLObjectType({
        name:"Viewer",
        fields:{
          allBooks: {
            type: new GraphQLNonNull(BookConnection),
            args:{...connectionArgs,order:{type:GraphQLString},filter:{type:GraphQLString}},
            resolve: (_,args) => {
              const titleContainsFilter=args.filter==null || args.filter=="" ? {}:{title:{$regex:new RegExp(".*"+args.filter+".*"),$options:'i'}};
              return connectionFromPromisedArray(BookModel.getBooks(args.order,titleContainsFilter),args)
            }
          },
          id:{
            type:new GraphQLNonNull(GraphQLID),
            args:{},
            resolve: (_,args)=>"viewer-fixed"
          }
        }
      });

const AuthorViewer=new GraphQLObjectType({
        name:"AuthorViewer",
        fields:{
          allAuthors: {
            type: new GraphQLNonNull(AuthorConnection),
            args:connectionArgs,
            resolve: (_,args) => connectionFromPromisedArray(AuthorModel.getAuthors(),args)
          },
          id:{
            type:new GraphQLNonNull(GraphQLID),
            args:{},
            resolve: (_,args)=>"author-viewer-fixed"
          }
        }
      });

const Query= new GraphQLObjectType({
  name:'Query',
  description:'Query for book app',
  fields : {
    node:nodeField,
    users: {
      type:UserConnection,
      args:connectionArgs,
      resolve: (_,args)=>connectionFromPromisedArray(UserModel.getUsers(),args)
    },
    authors: {
      type:AuthorConnection,
      args:connectionArgs,
      resolve:(_,args)=> connectionFromPromisedArray(AuthorModel.getAuthors(),args)
    },
    books: {
      type:BookConnection,
      args:connectionArgs,
      resolve:(_,args)=> connectionFromPromisedArray(BookModel.getBooks(),args)
    },
    viewer:{
      name:"Viewer",
      type:new GraphQLNonNull(Viewer),
      resolve: (_,args)=> {return {}}
    },
    authorviewer:{
      name:'AuthorViewer',
      type:AuthorViewer,
      resolve: (_,args)=> {return {}}
    }
  }
});

module.exports=Query;
