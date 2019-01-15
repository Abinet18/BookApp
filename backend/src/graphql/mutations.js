const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInt
} = require("graphql");

const {globalIdField,connectionDefinitions}=require("graphql-relay");
const { fromGlobalId,toGlobalId } = require("graphql-relay");
const {mutationWithClientMutationId} = require("graphql-relay");
const AuthorModel=require('../models/AuthorModel');
const UserModel = require('../models/UserModel');
const BookModel=require('../models/BookModel');
const {User,CreateUserInput,Comment,AddCommentInput,Author,CreateAuthorInput,Book,CreateBookInput,UpdateBookInput} = require('./types.js');
const {BOOK_ADDED,COMMENT_ADDED,pubsub} = require("./subscriptions");

const AddUserMutation = mutationWithClientMutationId({
  name:"AddUser",
  inputFields: {user:{type:CreateUserInput}},
  outputFields:{user:{type:User}},
  mutateAndGetPayload: args=> {
    return new Promise((resolve,reject)=>{
      UserModel.createUser(args.user).then(user=>resolve({user})).catch(reject);
    });
  }
})

const LoginUserMutation = mutationWithClientMutationId({
  name:"LoginUser",
  inputFields: {
          username:{type:GraphQLString},
          password: {type:GraphQLString}
        },
  outputFields:{
    token: {type:GraphQLString}
  },
  mutateAndGetPayload: args=> {
    return new Promise((resolve,reject)=>{
      UserModel.loginUser(args.username,args.password).then(token=>resolve({token:token})).catch(reject);
    });
  }
})

const AddAuthorMutation = mutationWithClientMutationId({
  name:"AddAuthor",
  inputFields: {author:{type:CreateAuthorInput}},
  outputFields:{
    author: {type:Author}
  },
  mutateAndGetPayload: (args,context)=> {
    //if(context.user==null) return null;
    return new Promise((resolve,reject)=>{
      AuthorModel.createAuthor(args.author).then(author=>resolve({author})).catch(reject);
    });
  }
})

const AddBookMutation = mutationWithClientMutationId({
  name:"AddBook",
  inputFields:{book:{type:CreateBookInput}},
  outputFields:{
    book: {type:Book}
  },
  mutateAndGetPayload: args=> {
    return new Promise((resolve,reject)=>{
      const book=args.book;
      const {id} = fromGlobalId(book.authorid);
      book.authorid=id;
      BookModel.createBook(book).then(book=>{
      //  console.log(book,BOOK_ADDED,pubsub);

        pubsub.publish(BOOK_ADDED,{addBook:book});
        //sendMail(book.title);
        resolve({book})}).catch(reject);
    });
  }
})
const DeleteBookMutation = mutationWithClientMutationId({
  name:"DeleteBook",
  inputFields:{id:{type:GraphQLID}},
  outputFields:{
    id: {type:GraphQLID}
  },
  mutateAndGetPayload: args=> {
    return new Promise((resolve,reject)=>{
      const bookid=args.id;
      const {id} = fromGlobalId(bookid);
      BookModel.deleteBook(id).then((id)=>resolve({id:bookid})).catch(reject);
    });
  }
})

const UpdateBookMutation = mutationWithClientMutationId({
  name:"UpdateBook",
  inputFields:{book:{type:UpdateBookInput}},
  outputFields:{
    book: {type:Book}
  },
  mutateAndGetPayload: args=> {
    return new Promise((resolve,reject)=>{
      const book=args.book;
      const {id} = fromGlobalId(book.id);
      book.id=id;
      if(book.authorid)
      {
        book.authorid=fromGlobalId(book.authorid).id;
      }
      BookModel.updateBook(book).then((book)=>resolve({book})).catch(reject);
    });
  }
})

const DeleteAuthorMutation = mutationWithClientMutationId({
  name:"DeleteAuthor",
  inputFields:{id:{type:GraphQLID}},
  outputFields:{
    id: {type:GraphQLID}
  },
  mutateAndGetPayload: args=> {
    return new Promise((resolve,reject)=>{
      const authorid=args.id;
      const {id} = fromGlobalId(authorid);
      AuthorModel.deleteAuthor(id).then((id)=>resolve({id:authorid})).catch(reject);
    });
  }
})

const AddCommentMutation = mutationWithClientMutationId({
  name:"AddComment",
  inputFields: {comment:{type:AddCommentInput}},
  outputFields:{
    book: {type:Book}
  },
  mutateAndGetPayload: (args,context)=> {
    return new Promise((resolve,reject)=>{
      const bookid=fromGlobalId(args.comment.bookid).id;
       const userid=context.user.id;
      BookModel.addComment(bookid,{userid:userid,comment:args.comment.comment}).then(book=>
        {
          pubsub.publish(`${COMMENT_ADDED}${args.comment.bookid}`,{addComment:book});
          resolve({book});
        }).catch(reject);

    });
  }
})

const Mutations= new GraphQLObjectType({
  description:"Mutations for our app",
  name:"Mutations",
  fields: {
    addUser: AddUserMutation,
    loginUser: LoginUserMutation,
    addAuthor : AddAuthorMutation,
    addBook : AddBookMutation,
    addComment: AddCommentMutation,
    deleteBook:DeleteBookMutation,
    deleteAuthor: DeleteAuthorMutation,
    updateBook: UpdateBookMutation
    }
  }
);

module.exports=Mutations;
