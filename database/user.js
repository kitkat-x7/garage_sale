const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const User= new Schema({
    //usage of Zod
    email:{type:String, unique:true, required:true},
    password:{ type: String, required:true },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    phone_number:{
        type:Number,
        required:true,
    }
});

const UserModel = mongoose.model("Users", User);

module.exports={
    UserModel,
}