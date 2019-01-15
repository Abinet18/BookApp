const { nodeDefinitions,fromGlobalId } = require("graphql-relay");

const AuthorModel = require('../models/AuthorModel');
const BookModel = require('../models/BookModel');
const UserModel = require('../models/UserModel');

const {nodeInterface,nodeField}= nodeDefinitions(
  globalId=> {
    const {type,id}=fromGlobalId(globalId);
    if(type=="Author")
    {
      return AuthorModel.getAuthor(id);
    }
    else if(type=="Book")
    {
      return BookModel.getBook(id);
    }
    else if(type=="User")
    {
      return UserModel.getUser(id);
    }
    return null;
  },
  object => {
    const {Author,User,Book}=require('../graphql/types');
    if(object.title) { return Book }
    else if(object.name) { return Author }
    else if(object.username) { return User }
    return null;
  }
);

module.exports = {nodeInterface,nodeField};
