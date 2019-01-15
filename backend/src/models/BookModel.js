const mongoose=require('./db');
const AuthorModel=require('./AuthorModel');
const UserModel=require('./UserModel');

const Schema=mongoose.Schema;
const bookSchema=new Schema({
  title: {type:String,unique:true,required:true},
  description: {type:String,required:true},
  authorid: {type:String,required:true,ref:"Author"},
  comments:{type:[{userid:{type:String,ref:"User",required:true},
                  comment:{type:String,required:true},
                  commentdate:{type:Date,required:true,default:new Date()}}],default:[]}
});

const BookModel=mongoose.model("Book",bookSchema);

module.exports = {
  getBooks : (order,filter)=> {
    return BookModel.find(filter).sort({_id:order=='DESC'?-1:1})
  },
  getBook: (id)=> {
    return BookModel.findById(id);
  },
  createBook: async book=> {
    const author=AuthorModel.getAuthor(book.authorid);
    if(author==null) return null;
    return BookModel(book).save();
  },
  updateBook: book=> {
    return BookModel.findByIdAndUpdate(book.id,{$set:{...book}},{new:true});
  },
  addComment : async (id,comment) => {
    const book=await BookModel.findById(id);
    if(book==null)
    {
      throw new Error('Book not found');
      return null;
    }
    const user=await UserModel.getUser(comment.userid);
    if(user==null) {
      throw new Error("User not found");
      return null;
    }
    return BookModel.findByIdAndUpdate(id,{$push:{comments:comment}},{new:true});
  },
  deleteBook: (id)=> {
    return BookModel.findByIdAndDelete(id);
  },
  getAuthorBooks: (authorid)=> {
    return BookModel.find({authorid});
  }
}
