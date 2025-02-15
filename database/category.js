const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const category= new Schema({
    //usage of Zod
    category:{
        type:String,
        required:true,
    }
});

const CategoryModel = mongoose.model("Catagories", category);

module.exports={
    CategoryModel,
}