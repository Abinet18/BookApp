const mongoose=require('./db');
const bcrypt =require('bcrypt');
const jwt=require('jsonwebtoken');

const {SECRET,HASH_ROUNDS}=require('./secret');

const Schema=mongoose.Schema;
const userSchema= new Schema({
  username: { type:String,unique:true,required:true},
  password : {type:String,required:true},
  fullname: {type:String,required:true},
  email : {type:String,required:true}
});

const UserModel=mongoose.model("USER",userSchema);

module.exports = {
  getUsers : ()=> {
    return UserModel.find();
  },
  getUser: (id)=> {
    return UserModel.findById(id);
  },
  createUser : (user)=> {
    user.password=bcrypt.hash(user.password,HASH_ROUNDS);
    return UserModel(user).save();
  },
  loginUser: async (username,password)=> {
    const user=await UserModel.findOne({username});
    if(!user) {
      throw new Error("Invalid User name")
    }
    const valid=await bcrypt.compare(password,user.password);
    if(!valid) {
      throw new Error("Incorrect password");
    }

    const token = jwt.sign({
      user:{id:user.id,username:username}
    },SECRET,{expiresIn:'1d'});
    console.log(token);

    return token;
  }

}
