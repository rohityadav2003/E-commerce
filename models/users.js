const mongoose=require("mongoose");
const usersschema=new mongoose.Schema({name:{type:String,required:true},mobile:{type:Number,required:true},email:{type:String,required:true},password:{type:String,required:true}});
const Users=mongoose.model("Users",usersschema);
module.exports=Users;