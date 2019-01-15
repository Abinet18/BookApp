const mongoose=require('./db');

const Schema=mongoose.Schema;
const authorSchema= new Schema({
  name:{type:String,unique:true,required:true},
  age: {type:Number,required:true},
  birthPlace:{type:String,required:true}
});

const AuthorModel=mongoose.model("Author",authorSchema);

module.exports = {
  getAuthors: ()=> {
    return AuthorModel.find();
  },
  getAuthor: (id)=> {
    return AuthorModel.findById(id);
  },
  createAuthor: (author)=> {
    return AuthorModel(author).save();
  },
  deleteAuthor: (id)=>{
    return AuthorModel.findByIdAndDelete(id);
  }
}
